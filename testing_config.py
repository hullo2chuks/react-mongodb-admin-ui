from flask_testing import TestCase
from application import create_app
from application.models import db
import os
from basedir import basedir
import json


class BaseTestConfig(TestCase):
    default_user = {
        "email": "default@gmail.com",
        "password": "something2"
    }

    def create_app(self):
        app = create_app('testing')
        return app

    def setUp(self):
        self.app = self.create_app().test_client()
        #db.create_all()
        res = self.app.post(
                "/api/v1/create_user",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        self.token = json.loads(res.data.decode("utf-8"))["token"]

    def tearDown(self):
        for cname in db.collection_names(False):
            db.drop_collection(cname)

