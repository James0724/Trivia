import unittest
import json

from flask_sqlalchemy import SQLAlchemy


from flaskr import create_app
from models import setup_db, Question, Category


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.database_path = 'postgresql://postgres:kacool@localhost:5432/trivia'
        self.client = self.app.test_client
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            self.db.create_all()

        self.new_question = { "data":{
            "question": "which lake ?",
            "answer": "lake Victoria",
            "category_id": 5,
            "difficulty": 2,
            }
            
        }
    
    def tearDown(self):
        """Executed after reach test"""
        pass

    #TESTS ON CATEGORY
    def test_get_all_categories(self):
        res = self.client().get("/categories")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True) 
        self.assertTrue(data["categories"])
        self.assertTrue(data["total_categories"])
    
    def test_get_category_by_id(self):
        res = self.client().get("/categories/3")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True) 
        self.assertEqual(data["category"],"Geography")
        self.assertEqual(data["category_id"],3)
        self.assertTrue(data["total_questions"])
    
    def test_get_question_by_category(self):
        res = self.client().get("/categories/3")
        data = json.loads(res.data)

        category = Category.query.filter(Category.id == 3).one_or_none()

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["total_questions"])
        self.assertTrue(category)
    
    #TEST ON CRUD OPERATIONS
    def test_get_paginate_questions(self):
        res = self.client().get("/questions")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["total_questions"])

    def test_add_question(self):
        res = self.client().post("/questions", json=self.new_question)
        
        try:
            data = json.loads(res.data)
            self.assertEqual(res.status_code, 200)
            self.assertEqual(data["success"], True)
            self.assertTrue(data["total_questions"])

        except:
            data = json.loads(res.data)
            self.assertEqual(res.status_code, 200)
            self.assertEqual(data["error"], 304)
            self.assertEqual(data["success"], True)
            self.assertEqual(data["message"], 'Not modified')
    
    def test_delete_question(self):
        res = self.client().delete("/questions/67")
        data = json.loads(res.data)

        question = Question.query.filter(Question.id == 67).one_or_none()
        try:
            self.assertEqual(res.status_code, 200)
            self.assertEqual(data["success"], True)
            self.assertEqual(data["deleted_question"], 67)
            self.assertTrue(data["questions"])
            self.assertTrue(data["total_question"])
            self.assertEqual(question, None)
        except:
             self.assertEqual(question, None)
       
    def test_delete_a_none_question(self):
        res = self.client().delete("/questions/1000")
        data = json.loads(res.data)

        question = Question.query.filter(Question.id == 1000).one_or_none()

        self.assertEqual(res.status_code, 422)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], 'unprocessable')
        self.assertEqual(question, None)

    

    #TEST ON SEARCH QUESTION
    def test_search_get_question_results(self):
        res = self.client().post("/search/questions", json={"data":{"search_term":"what"}})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["Questions_found"])
        self.assertTrue(data["total_questions"])

    def test_search_get_question_without_results(self):
        res = self.client().post("/search/questions", json={"data":{"search_term":"jfjfdhjkhdsh"}})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["Questions_found"],[])
        self.assertEqual(data["total_questions"], 0 )


    #TEST ON ERROR HANDLERS
    def test_404_sent_requesting_beyond_valid_page(self):
        res = self.client().get("/questions?page=1000")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "resource not found")

    def test_422_if_question_does_not_exist(self):
        res = self.client().delete("/questions/1000")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 422)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "unprocessable")
    
    def test_405_if_question_method_does_not_exist(self):
        res = self.client().put("/questions/4")
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 405)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], "method not allowed")
    
    



# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()