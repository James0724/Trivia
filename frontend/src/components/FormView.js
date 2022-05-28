import React, { Component } from "react";
import axios from "axios";

import "../stylesheets/FormView.css";

class FormView extends Component {
	constructor(props) {
		super();
		this.state = {
			question: "",
			answer: "",
			difficulty: 1,
			category: 1,
			categories: [],
		};
	}

	componentDidMount() {
		axios.get("/categories").then((res) => {
			const categories = res.data;
			this.setState({
				categories: categories.categories,
			});
		});
	}

	submitQuestion = (event) => {
		event.preventDefault();
		axios
			.post(
				"/questions",
				{
					data: {
						question: this.state.question,
						answer: this.state.answer,
						difficulty: this.state.difficulty,
						category_id: this.state.category,
					},
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
				alert("Question added successfully ");
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
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		return (
			<div id="add-form">
				<h2>Add a New Trivia Question</h2>
				<form
					className="form-view"
					id="add-question-form"
					onSubmit={this.submitQuestion}
				>
					<label>
						Question
						<input type="text" name="question" onChange={this.handleChange} />
					</label>
					<label>
						Answer
						<input type="text" name="answer" onChange={this.handleChange} />
					</label>
					<label>
						Difficulty
						<select name="difficulty" onChange={this.handleChange}>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</label>
					<label>
						Category
						<select name="category" onChange={this.handleChange}>
							{this.state.categories.map((category) => {
								return (
									<option key={category.id} value={category.id}>
										{category.id}
									</option>
								);
							})}
						</select>
					</label>
					<input type="submit" className="button" value="Submit" />
				</form>
			</div>
		);
	}
}

export default FormView;
