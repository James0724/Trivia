import React, { Component } from "react";
import axios from "axios";

import "../stylesheets/QuizView.css";

const questionsPerPlay = 5;

class QuizView extends Component {
	constructor(props) {
		super();
		this.state = {
			quizCategory: null,
			totalQuestions: [],
			currentAnswer: [],
			currentQuestionId: [],
			previousQuestions: [],
			showAnswer: false,
			categories: [],
			numCorrect: 0,
			currentQuestion: {},
			guess: "",
			forceEnd: false,
			allCategory: false,
		};
	}

	componentDidMount() {
		axios.all([
			axios.get("/categories").then((res) => {
				const categories = res.data;
				this.setState({
					categories: categories.categories,
				});
				//console.log(this.state.categories);
			}),
			// axios
			// 	.get("/quizzes")
			// 	.then((res) => {
			// 		const question = res.data;
			// 		//console.log(question);
			// 		//console.log(question.question);
			// 		this.setState({
			// 			currentQuestion: question.question,
			// 		});
			// 	})
			// 	.catch(catch_errors()),
		]);
	}

	componentDidUpdate(prevProp, prevState) {
		if (prevState.currentQuestionId !== this.state.currentQuestionId) {
			return true;
		} else {
			return false;
		}
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	getAllQuestions = () => {
		this.setState({
			allCategory: true,
		});
		axios
			.get("/quizzes")
			.then((res) => {
				const question = res.data;
				//console.log(question);
				//console.log(question.Question);
				this.setState({
					currentQuestion: question.question,
					currentAnswer: question.answer,
					currentQuestionId: question.id,
					quizCategory: question.category,
					totalQuestions: question.total_questions,
					previousQuestions: this.state.previousQuestions.concat(question.id),
				});
				//console.log(this.state.previousQuestions);
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					alert(
						`Unable to load questions. Internal server error ${error.response.status}`
					);
					console.log(error.response.data);
					console.log(error.response.status);
				} else if (error.request) {
					// The request was made but no response was received
					alert(`Unable to load questions. ${error.request}`);
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					alert(`Unable to load questions 3. ${error.message}`);
					console.log("Error", error.message);
				}
			});
	};
	getAllNextQuestion = () => {
		this.setState({
			showAnswer: false,
		});
		axios
			.get("/quizzes")
			.then((res) => {
				const question = res.data;
				//console.log(question);
				//console.log(question.Question);
				this.setState({
					currentQuestion: question.question,
					currentAnswer: question.answer,
					currentQuestionId: question.id,
					quizCategory: question.category,
					totalQuestions: question.total_questions,
					previousQuestions: this.state.previousQuestions.concat(question.id),
				});
				//console.log(this.state.previousQuestions);
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					alert(
						`Unable to load questions. Internal server error ${error.response.status}`
					);
					console.log(error.response.data);
					console.log(error.response.status);
				} else if (error.request) {
					// The request was made but no response was received
					alert(`Unable to load questions. ${error.request}`);
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					alert(`Unable to load questions 3. ${error.message}`);
					console.log("Error", error.message);
				}
			});
	};
	async getQuestion(props) {
		var category_id = props;
		let response = await axios
			.get(`/quizzes/${category_id}`)
			.then((res) => {
				//console.log(res);
				return res;
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					alert(
						`Unable to load questions. Internal server error ${error.response.status}`
					);
					console.log(error.response.data);
					console.log(error.response.status);
				} else if (error.request) {
					// The request was made but no response was received
					alert(`Unable to load questions. ${error.request}`);
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					alert(`Unable to load questions 3. ${error.message}`);
					console.log("Error", error.message);
				}
			});

		var res = response.data;

		this.setState({
			currentQuestion: res.question,
			currentAnswer: res.answer,
			currentQuestionId: res.id,
			quizCategory: res.category,
			totalQuestions: res.total_questions,
			previousQuestions: this.state.previousQuestions.concat(res.id),
		});
	}
	getNextQuestion = () => {
		this.setState({
			showAnswer: false,
		});
		var category_id = this.state.quizCategory;
		axios
			.get(`/quizzes/${category_id}`)
			.then((res) => {
				const question = res.data;
				//console.log(question);
				var prev = this.state.previousQuestions;
				var instanceCurrent = question.id;
				var finalItem =
					this.state.previousQuestions.length <= this.state.totalQuestions;
				if (!prev.includes(instanceCurrent)) {
					this.setState({
						currentQuestion: question.question,
						currentAnswer: question.answer,
						previousQuestions: prev.concat(question.id),
					});
				} else if (
					!prev.includes(instanceCurrent) === true &&
					finalItem === false
				) {
					this.getQuestion(this.state.quizCategory);
				} else if (finalItem === true) {
					this.setState({
						forceEnd: true,
					});
				}
			})
			.catch(function (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					alert(
						`Unable to load questions. Internal server error ${error.response.status}`
					);
					console.log(error.response.data);
					console.log(error.response.status);
				} else if (error.request) {
					// The request was made but no response was received
					alert(`Unable to load questions. ${error.request}`);
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					alert(`Unable to load questions 3. ${error.message}`);
					console.log("Error", error.message);
				}
			});
	};
	submitGuess = (event) => {
		event.preventDefault();
		let evaluate = this.evaluateAnswer();
		this.setState({
			showAnswer: true,
		});
		this.setState({
			numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
			showAnswer: true,
		});
		//console.log(this.state.previousQuestions);
	};
	restartGame = () => {
		this.setState({
			quizCategory: null,
			totalQuestions: [],
			currentAnswer: [],
			currentQuestionId: [],
			previousQuestions: [],
			showAnswer: false,
			numCorrect: 0,
			currentQuestion: {},
			forceEnd: false,
			allCategory: false,
		});
	};

	renderPrePlay() {
		return (
			<div className="quiz-play-holder">
				<div className="choose-header">Choose Category</div>
				<div className="category-holder">
					<div className="play-category" onClick={this.getAllQuestions}>
						ALL
					</div>
					{this.state.categories.map((category) => {
						return (
							<div
								key={category.id}
								value={category.id}
								className="play-category"
								onClick={() => this.getQuestion(category.id)}
							>
								{category.type}
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	renderFinalScore() {
		return this.state.allCategory ||
			this.state.totalQuestions > questionsPerPlay ? (
			<div className="quiz-play-holder">
				<div className="final-header">
					Your Final Score is {this.state.numCorrect} out of {questionsPerPlay}
				</div>
				<div className="play-again button" onClick={this.restartGame}>
					Play Again?
				</div>
			</div>
		) : (
			<div className="quiz-play-holder">
				<div className="final-header">
					Your Final Score is {this.state.numCorrect} out of{" "}
					{this.state.totalQuestions}
				</div>
				<div className="play-again button" onClick={this.restartGame}>
					Play Again?
				</div>
			</div>
		);
	}

	evaluateAnswer = () => {
		const formatGuess = this.state.guess
			// eslint-disable-next-line
			.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
			.toLowerCase();
		const answerArray = this.state.currentAnswer.toLowerCase().split(" ");
		return answerArray.every((el) => formatGuess.includes(el));
	};

	renderCorrectAnswer() {
		let evaluate = this.evaluateAnswer();
		return this.state.allCategory ? (
			<div className="quiz-play-holder">
				<div className="quiz-question">{this.state.currentQuestion}</div>
				<div className={`${evaluate ? "correct" : "wrong"}`}>
					{evaluate ? "You were correct!" : "You were incorrect"}
				</div>
				<div className="quiz-answer">{this.state.currentAnswer}</div>
				<div className="next-question button" onClick={this.getAllNextQuestion}>
					{" "}
					Next Question{" "}
				</div>
			</div>
		) : (
			<div className="quiz-play-holder">
				<div className="quiz-question">{this.state.currentQuestion}</div>
				<div className={`${evaluate ? "correct" : "wrong"}`}>
					{evaluate ? "You were correct!" : "You were incorrect"}
				</div>
				<div className="quiz-answer">{this.state.currentAnswer}</div>
				<div className="next-question button" onClick={this.getNextQuestion}>
					{" "}
					Next Question{" "}
				</div>
			</div>
		);
	}

	renderPlay() {
		return this.state.previousQuestions.length === questionsPerPlay + 1 ||
			this.state.forceEnd ? (
			this.renderFinalScore()
		) : this.state.showAnswer ? (
			this.renderCorrectAnswer()
		) : (
			<div className="quiz-play-holder">
				<div className="quiz-question">{this.state.currentQuestion}</div>
				<form onSubmit={this.submitGuess}>
					<input type="text" name="guess" onChange={this.handleChange} />
					<input
						className="submit-guess button"
						type="submit"
						value="Submit Answer"
					/>
				</form>
			</div>
		);
	}

	render() {
		return this.state.quizCategory ? this.renderPlay() : this.renderPrePlay();
	}
}

export default QuizView;
