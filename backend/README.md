# Backend - Trivia API

## Setting up the Backend

### Install Dependencies

1. **Python 3.7** - Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

2. **Virtual Environment** - We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

3. **PIP Dependencies** - Once your virtual environment is setup and running, install the required dependencies by navigating to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

#### Key Pip Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use to handle the lightweight SQL database. You'll primarily work in `app.py`and can reference `models.py`.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross-origin requests from our frontend server.

### Set up the Database

With Postgres running, create a `trivia` database:

```bash
createbd trivia
```

Populate the database using the `trivia.psql` file provided. From the `backend` folder in terminal run:

```bash
psql trivia < trivia.psql
```

### Run the Server

From within the `./src` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
flask run --reload
```

The `--reload` flag will detect file changes and restart the server automatically.

## Endpoints

`GET '/api/v1.0/categories'`

- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the category
- Request Arguments: None
- Returns: An object with a single key, `categories`, that contains an object of `id: category_string` key: value pairs.

```json
{
	"1": "Science",
	"2": "Art",
	"3": "Geography",
	"4": "History",
	"5": "Entertainment",
	"6": "Sports"
}
```

`GET '/api/v1.0/categories/<int:category_id>'`

- Fetches a specific category by id provided in the variable. In with the keys being category, category_id, questions, success and total_questions. The corresponding string to each key is the values contained in the category i.e category name, category id, questions in that category, success is true or false, and the total_questions in the categoty respectively.
- Request Arguments: category id
- Returns: An object with key, `category`, `category_id`, `questions`, `success` and `total_questions` containig there key: value pairs.

```json
{
	"category": "Science",
	"category_id": 1,
	"questions": [
		{
			"answer": "The Liver",
			"category_id": 1,
			"difficulty": 4,
			"id": 1,
			"question": "What is the heaviest organ in the human body?"
		},
		{
			"answer": "Alexander Fleming",
			"category_id": 1,
			"difficulty": 3,
			"id": 2,
			"question": "Who discovered penicillin?"
		}
	],
	"success": true,
	"total_questions": 2
}
```

`GET '/api/v1.0/questions'`

- Fetches a dictionary of questions, which are 10 questions per page, to accses the next page you just provide the parameter in the url `/api/v1.0/questions?page=<pageNo>`, the pageNo is always defaulted to the firt page No:1
- Request Arguments: none or page number
- Returns: An object with a key, `Questions`, that contains an object of `Question: []` key: value pairs 10 per page.

```json
{
	"Question": [
		{
			"answer": "Maya Angelou",
			"category_id": 4,
			"difficulty": 2,
			"id": 1,
			"question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
		},
		{
			"answer": "Edward Scissorhands",
			"category_id": 5,
			"difficulty": 3,
			"id": 2,
			"question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
		},
		{
			"answer": "Muhammad Ali",
			"category_id": 4,
			"difficulty": 1,
			"id": 3,
			"question": "What boxer's original name is Cassius Clay?"
		},
		{
			"answer": "Brazil",
			"category_id": 6,
			"difficulty": 3,
			"id": 4,
			"question": "Which is the only team to play in every soccer World Cup tournament?"
		},
		{
			"answer": "Uruguay",
			"category_id": 6,
			"difficulty": 4,
			"id": 5,
			"question": "Which country won the first ever soccer World Cup in 1930?"
		},
		{
			"answer": "George Washington Carver",
			"category_id": 4,
			"difficulty": 2,
			"id": 6,
			"question": "Who invented Peanut Butter?"
		},
		{
			"answer": "Lake Victoria",
			"category_id": 3,
			"difficulty": 2,
			"id": 7,
			"question": "What is the largest lake in Africa?"
		},
		{
			"answer": "The Palace of Versailles",
			"category_id": 3,
			"difficulty": 3,
			"id": 8,
			"question": "In which royal palace would you find the Hall of Mirrors?"
		},
		{
			"answer": "Agra",
			"category_id": 3,
			"difficulty": 2,
			"id": 9,
			"question": "The Taj Mahal is located in which Indian city?"
		},
		{
			"answer": "Escher",
			"category_id": 2,
			"difficulty": 1,
			"id": 10,
			"question": "Which Dutch graphic artist–initials M C was a creator of optical illusions?"
		}
	],
	"success": true,
	"total_questions": 22
}
```

`DELETE '/api/v1.0/questions/<int:id>'`

- Deletes a question by id and return the rest of the remaining questions
- Request Arguments: question id
- Returns: An object with the deleted_question id and the remaining questions in a key: value pairs respectively 10 per page.

```json
{
	"deleted_question": 24,
	"questions": [
		{
			"answer": "Maya Angelou",
			"category_id": 4,
			"difficulty": 2,
			"id": 1,
			"question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
		},
		{
			"answer": "Edward Scissorhands",
			"category_id": 5,
			"difficulty": 3,
			"id": 2,
			"question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
		},
		{
			"answer": "Muhammad Ali",
			"category_id": 4,
			"difficulty": 1,
			"id": 3,
			"question": "What boxer's original name is Cassius Clay?"
		}
	],
	"success": true,
	"total_question": 3
}
```

`POST '/api/v1.0/questions"'`

- Post a qiestion to the database
- Request Arguments: the questions to be added, answer of the question, difficult level and the category it belongs to

  ```json
  {
  	"data": {
  		"question": "which lake ?",
  		"answer": "lake Victoria",
  		"category_id": 5,
  		"difficulty": 2
  	}
  }
  ```

  ```

  ```

- Returns: a json oject of success key with the value true on sucess and the rest if the questions and the new total number of questions available

```json
{
	"Question": [
		{
			"answer": "Maya Angelou",
			"category_id": 4,
			"difficulty": 2,
			"id": 1,
			"question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
		},
		{
			"answer": "Edward Scissorhands",
			"category_id": 5,
			"difficulty": 3,
			"id": 2,
			"question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
		},
		{
			"answer": "Lake Victoria",
			"category_id": 3,
			"difficulty": 2,
			"id": 3,
			"question": "What is the largest lake in Africa?"
		},
		{
			"answer": "lake Victoria",
			"category_id": 5,
			"difficulty": 2,
			"id": 4,
			"question": "which lake ?"
		}
	],
	"success": true,
	"total_questions": 4
}
```

`POST '/api/v1.0/search/questions'`

- search in the database for a matching string with the provided search term
- Request Arguments: None
- Returns: An object with the matching items in the database with a succes if it's true or false, it also return the total number of questions found matching the string and an empty list if no value was found but the success will remain to true.

for exampe the search term `what` will produce the following object.

```json
{
	"Questions_found": [
		{
			"answer": "Edward Scissorhands",
			"category_id": 5,
			"difficulty": 3,
			"id": 6,
			"question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
		},
		{
			"answer": "Muhammad Ali",
			"category_id": 4,
			"difficulty": 1,
			"id": 9,
			"question": "What boxer's original name is Cassius Clay?"
		},
		{
			"answer": "Lake Victoria",
			"category_id": 3,
			"difficulty": 2,
			"id": 13,
			"question": "What is the largest lake in Africa?"
		},
		{
			"answer": "Mona Lisa",
			"category_id": 2,
			"difficulty": 3,
			"id": 17,
			"question": "La Giaconda is better known as what?"
		},
		{
			"answer": "The Liver",
			"category_id": 1,
			"difficulty": 4,
			"id": 20,
			"question": "What is the heaviest organ in the human body?"
		},
		{
			"answer": "Blood",
			"category_id": 4,
			"difficulty": 4,
			"id": 22,
			"question": "Hematology is a branch of medicine involving the study of what?"
		},
		{
			"answer": "stapes",
			"category_id": 1,
			"difficulty": 3,
			"id": 33,
			"question": "what's the smallest bone in a human ear?"
		},
		{
			"answer": "4",
			"category_id": 6,
			"difficulty": 1,
			"id": 86,
			"question": "what is 2 + 2"
		}
	],
	"success": true,
	"total_questions": 8
}
```

`GET '/api/v1.0/quizzes/<int:category_id>'`

- get random quizzes from a specific category id
- Request Arguments: category id to fetch questions from
- Returns: a random question from the category upto the 5th questions if more than 5 questions exist in the category otherwise it will return all the questions till the end.

json formart of a randomly seleceted question is as follows:

```json
{
	"answer": "stapes",
	"category": 1,
	"id": 33,
	"question": "what's the smallest bone in a human ear?",
	"success": true,
	"total_questions": 3
}
```

`GET '/api/v1.0/quizzes/<int:category_id>'`

- get random quizzes from all category randomly
- Request Arguments: none
- Returns: a random question from the category upto the 5th question from the randomly selected categories

json formart of a randomly seleceted question is as follows:

```json
{
	"answer": "stapes",
	"category": 1,
	"id": 33,
	"question": "what's the smallest bone in a human ear?",
	"success": true,
	"total_questions": 3
}
```

## Testing

The modeule for testing can be found in the `test_flaskr.py`. The test basically test for the following operations:

- TESTS ON CATEGORY: which chesks whether categories exists and you can actually get a category by id.
- TEST ON CRUD OPERATIONS: which checks whether questions can be added or deleted
- TEST ON SEARCH QUESTION: which checks if the correct respond is provided when there is a match and when there is no match
- TEST ON ERROR HANDLERS: finally it checks whether the right errors are returned as appropriate.
