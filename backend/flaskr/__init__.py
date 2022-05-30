import json
from flask import Flask, request, abort, jsonify
from flask_cors import CORS, cross_origin
import random
from flask_sqlalchemy import Model

from sqlalchemy import JSON

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10

def paginate_questions(request, questions):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    question = [question.format() for question in questions]
    current_questions = question[start:end]

    return current_questions

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)
    
    #CORs headers
    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response

    #GET ALL CATEGORIES
    @app.route("/api/v1.0/categories")
    def retrieve_categories():
        categories = [category.format() for category in Category.query.all()]

        #print(Category.query.all())
        return jsonify(
            {
                "success": True,
                "categories": categories,
                "total_categories": len(Category.query.all()),
            }
        )

    #GET ALL CATEGORY BY ID
    @app.route('/api/v1.0/categories/<int:category_id>')
    def get_category_by_id(category_id):
        category = Category.query.get(category_id)
        category_questions = Question.query.filter_by(category_id = category_id).all()
        question = [question.format() for question in category_questions]

        return jsonify(
            {
                "success": True,
                "category": category.type,
                "category_id": category.id,
                "questions":question,
                "total_questions": len(category_questions),
            }
        )


    #GET ALL QUESTIONS 10 PER PAGE
    @app.route("/api/v1.0/questions")
    def retrieve_questions():
        questions = Question.query.order_by(Question.id).all()
        current_questions = paginate_questions(request, questions)

        if len(current_questions) == 0:
            abort(404)
        
        return jsonify(
            {
                "success": True,
                "Question": current_questions,
                "total_questions": len(Question.query.all()),
            }
        )

    #DELETE A QUESTION PERMANENTLY
    @app.route("/api/v1.0/questions/<int:question_id>", methods=["DELETE"])
    def delete_book(question_id):
        try:
            question = Question.query.filter(Question.id == question_id).one_or_none()

            if question is None:
                abort(404)
            question.delete()

            questions = Question.query.order_by(Question.id).all()
            current_questions = paginate_questions(request, questions)

            return jsonify(
                {
                    "success": True,
                    "deleted_question": question_id,
                    "questions": current_questions,
                    "total_question": len(Question.query.all()),
                }
            )

        except:
            abort(422)

    #POST A QUESTION AND LIST IT AT THE END OF THE LAST PAGE
    @app.route("/api/v1.0/questions", methods=["POST"])
    def create_new_question():
        body = json.loads(request.data)
        
        new_question = body['data']['question']
        difficulty_level = body['data']['difficulty']
        category_id = body['data']['category_id']
        the_answer = body['data']['answer']

        try:
            question = Question(question=new_question, difficulty=difficulty_level, category_id=category_id, answer=the_answer)
            question.insert()
            

            questions= Question.query.order_by(Question.id).all()
            current_questions = paginate_questions(request, questions)

            return jsonify(
                {
                "success": True,
                "Question": current_questions,
                "total_questions": len(Question.query.all()),
            }
            )

        except:
            return jsonify(
                {"success": True, 
                "error": 304, 
                "message": "Not modified"
                }
                )

   
    #SEARCH QUESTIONS 
    @app.route("/api/v1.0/search/questions", methods=["POST"])
    def search_questions():
        body = request.get_json()

        search_questions = body['data']['search_term']
        
        questions = Question.query.filter(Question.question.ilike('%'+search_questions+'%')).all()

        if questions is None:
            return  {
                "success": True,
                "Questions_found": [],
                "total_questions": 0,
            }
        current_questions = paginate_questions(request, questions)
        return  {
                "success": True,
                "Questions_found": current_questions,
                "total_questions": len(questions),
            }

    #QUESTIONS BASED IN THE CATEGORY
    @app.route("/api/v1.0/categories/<int:category_id>", methods=['GET'])
    def category_questions(category_id):
        category = Category.query.get(category_id)
        questions = category.questions

        current_questions = paginate_questions(request, questions) # I am always returning a paginated_questions incase they are more than 10 questions
        print(current_questions)
        if len(current_questions) == 0: # when no question in a category is found in the database
            abort(404)
        
        return jsonify(
            {
                "success": True,
                "Question": current_questions,
                "total_questions": len(questions),
            }
        )
    #GET RANDOM QUIZZES
    @app.route("/api/v1.0/quizzes/<int:category_id>")
    def get_random_quizzes_by_category(category_id):
        category = Category.query.get(category_id)
        #question =[question.format() for question in category.questions]
        
        random_id_pool = []  # create a pool of id where to get a random question
        for i in range(len(category.questions)):
            random_id_pool.append(category.questions[i].id)
        
        random_id_question = random.choice(random_id_pool)
        question = Question.query.get(random_id_question)
        print(question)
        
        return jsonify(
            {
                "success": True,
                "question": question.question,
                "answer": question.answer,
                "total_questions":len(random_id_pool),
                "category":question.category_id,
                "id":question.id,   
            }
         )
    @app.route("/api/v1.0/quizzes")
    def get_all_quizzes():
        questions = Question.query.all() #get all questions in the data base
        random_id_pool = []  # create a pool of id where to get a random question
        for i in range(len(questions)):
            random_id_pool.append(questions[i].id)
        
        random_id_question = random.choice(random_id_pool)
        question = Question.query.get(random_id_question)
        
        return jsonify(
            {
               "success": True,
                "question": question.question,
                "answer": question.answer,
                "total_questions":len(random_id_pool),
                "category":question.category_id,
                "id":question.id,     
            }
        )
    @app.errorhandler(404)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 404, "message": "resource not found"}),
            404,
        )

    @app.errorhandler(422)
    def unprocessable(error):
        return (
            jsonify({"success": False, "error": 422, "message": "unprocessable"}),
            422,
        )

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": 400, "message": "bad request"}), 400

    @app.errorhandler(405)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 405, "message": "method not allowed"}),
            405,
        )


    return app

