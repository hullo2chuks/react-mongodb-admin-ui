from testing_config import BaseTestConfig
from application.models import User
import json
from application.utils import auth


class TestAPI(BaseTestConfig):
    some_user = {
        "email": "one@gmail.com",
        "password": "something1"
    }

    def test_get_spa_from_index(self):
        result = self.app.get("/")
        self.assertIn('</html>', result.data.decode("utf-8"))

    def test_create_new_user(self):
        self.assertIsNone(User.find_one({
                'email': self.some_user["email"]
        }))

        res = self.app.post(
                "/api/v1/create_user",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(json.loads(res.data.decode("utf-8"))["token"])
        self.assertEqual(User.find_one({'email': self.some_user["email"]})['email'], self.some_user["email"])

        res2 = self.app.post(
                "/api/v1/create_user",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )
        self.assertEqual(res2.status_code, 409)

    def test_get_token_and_verify_token(self):
        res = self.app.post(
                "/api/v1/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        token = json.loads(res.data.decode("utf-8"))["token"]
        self.assertTrue(auth.verify_token(token))
        self.assertEqual(res.status_code, 200)

        res2 = self.app.post(
                "/api/v1/is_token_valid",
                data=json.dumps({"token": token}),
                content_type='application/json'
        )

        self.assertTrue(json.loads(res2.data.decode("utf-8")), ["token_is_valid"])

        res3 = self.app.post(
                "/api/v1/is_token_valid",
                data=json.dumps({"token": token + "something-else"}),
                content_type='application/json'
        )

        self.assertEqual(res3.status_code, 403)

        res4 = self.app.post(
                "/api/v1/get_token",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )

        self.assertEqual(res4.status_code, 403)

    def test_protected_route(self):
        headers = {
            'Authorization': self.token,
        }

        bad_headers = {
            'Authorization': self.token + "bad",
        }

        response = self.app.get('/api/v1/user', headers=headers)
        self.assertEqual(response.status_code, 200)
        response2 = self.app.get('/api/v1/user')
        self.assertEqual(response2.status_code, 401)
        response3 = self.app.get('/api/v1/user', headers=bad_headers)
        self.assertEqual(response3.status_code, 401)
