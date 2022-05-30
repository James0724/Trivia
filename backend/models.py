from sqlalchemy import Column, String, Integer, ForeignKey, create_engine
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

database_path = 'postgresql://postgres:kacool@localhost:5432/trivia'
"""
setup_db(app)
    binds a flask application and a SQLAlchemy service
"""
def setup_db(app, dbpath=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = dbpath 
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['FLASK_DEBUG'] = True
    db.app = app
    Migrate(app, db)
    db.init_app(app)
    db.create_all()

"""
Question

"""
class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    question = Column(String, unique=True)
    answer = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    difficulty = Column(Integer, nullable=False)

    def __init__(self, question, answer, category_id, difficulty):
        self.question = question
        self.answer = answer
        self.category_id = category_id
        self.difficulty = difficulty

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'category_id': self.category_id,
            'difficulty': self.difficulty
            }

"""
Category

"""
class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)
    questions = relationship('Question', backref='categories', lazy=True)

    def __init__(self, type):
        self.type = type

    def format(self):
        return {
            'id': self.id,
            'type': self.type
            }
    # def __repr__(self):
    #     return f'{self.id}:{self.type}'