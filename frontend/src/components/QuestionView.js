import React, { Component } from "react";
import axios from "axios";

import "../stylesheets/App.css";

import Question from "./Question";
import Search from "./Search";

class QuestionView extends Component {
	constructor() {
		super();
		this.state = {
			questions: [],
			page: 1,
			totalQuestions: 0,
			categories: [],
			currentCategory: false,
		};
	}

	componentDidMount() {
		this.getQuestions();
	}

	getQuestions = () => {
		axios
			.all([
				axios.get("/api/v1.0/categories").then((res) => {
					const categories = res.data;
					this.setState({
						categories: categories.categories,
					});
				}),
				axios.get(`/api/v1.0/questions?page=${this.state.page}`).then((res) => {
					const question = res.data;
					this.setState({
						questions: question.Question,
						totalQuestions: question.total_questions,
						currentCategory: question.current_category,
					});
				}),
			])
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

	selectPage(num) {
		this.setState({ page: num }, () => this.getQuestions());
	}

	createPagination() {
		let pageNumbers = [];
		let maxPage = Math.ceil(this.state.totalQuestions / 10);
		for (let i = 1; i <= maxPage; i++) {
			pageNumbers.push(
				<span
					key={i}
					className={`page-num ${i === this.state.page ? "active" : ""}`}
					onClick={() => {
						this.selectPage(i);
					}}
				>
					{i}
				</span>
			);
		}
		return pageNumbers;
	}

	getByCategory = (id) => {
		axios
			.get(`/api/v1.0/categories/${id}`)
			.then((res) => {
				const category = res.data;
				this.setState({
					currentCategory: category.questions,
				});
				//console.log(this.state.currentCategory);
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

	submitSearch = (searchTerm) => {
		axios
			.post(
				"/api/v1.0/search/questions",
				{
					data: { search_term: searchTerm },
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{
					crossDomain: true,
				},
				{
					xhrFields: {
						withCredentials: true,
					},
				}
			)
			.then((res) => {
				const result = res.data;
				console.log(result);
				this.setState({
					questions: result.Questions_found,
					totalQuestions: result.total_questions,
					currentCategory: false,
				});
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

	questionAction = (id) => (action) => {
		if (action === "DELETE") {
			if (window.confirm("are you sure you want to delete the question?")) {
				axios
					.delete(`/api/v1.0/questions/${id}`)
					.then((res) => {
						alert("Question succesfully deleted");
						this.getQuestions();
					})
					.catch(function (error) {
						alert(
							"Unable to delete the questions. Please try your request again"
						);
						console.log(error);
					});
			}
		}
	};

	render() {
		return (
			<div className="question-view">
				<div className="categories-list">
					<h2
						onClick={() => {
							this.getQuestions();
						}}
					>
						Categories
					</h2>
					<ul>
						{this.state.categories.map((category) => (
							<li
								key={category.id}
								onClick={() => {
									this.getByCategory(category.id);
								}}
							>
								<img
									className="category"
									alt={`${category.type.toLowerCase()}`}
									src={`${category.type.toLowerCase()}.svg`}
								/>
							</li>
						))}
					</ul>
					<Search submitSearch={this.submitSearch} />
				</div>
				<div className="questions-list">
					<h2>Questions</h2>
					{this.state.currentCategory ? (
						this.state.currentCategory.map((question) => (
							<Question
								key={question.id}
								question={question.question}
								answer={question.answer}
								category={this.state.categories[question.category_id - 1]}
								difficulty={question.difficulty}
								questionAction={this.questionAction(question.id)}
							/>
						))
					) : (
						<>
							{" "}
							{this.state.questions.map((question) => (
								<Question
									key={question.id}
									question={question.question}
									answer={question.answer}
									category={this.state.categories[question.category_id - 1]}
									difficulty={question.difficulty}
									questionAction={this.questionAction(question.id)}
								/>
							))}
							<div className="pagination-menu">{this.createPagination()}</div>
						</>
					)}
				</div>
			</div>
		);
	}
}

export default QuestionView;
