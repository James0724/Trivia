# API Development and Documentation Final Project

## Trivia App

Trivia app is a bonding experience between udacity and its students, the sudents are supposed to help finish the trivia app. Trivia app itself is an app that users choose to play a game in which they try to answer some random questions or categorized questions, as they try to see who's the most knowledgeable of the bunch.

The application:

1. Display questions - both all questions and by category. Questions show the question, category and difficulty rating by default and can show/hide the answer.
2. You can delete questions.
3. You can add questions and require that they include question and answer text.
4. You can search for questions based on a text query string.
5. You can play the quiz game, randomizing either all questions or within a specific category.

## About the Stack

### Backend

The [backend](./backend/README.md) directory contains a completed Flask and SQLAlchemy server. The endpoints are defined in `__init__.py` which reference models.py for DB and SQLAlchemy setup.

> View the [Backend README](./backend/README.md) for more details.

### Frontend

The [frontend](./frontend/README.md) directory contains a complete React frontend to consume the data from the Flask server.

> View the [Frontend README](./frontend/README.md) for more details.
