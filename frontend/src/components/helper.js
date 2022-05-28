export const catch_errors = (error) =>
	function (error) {
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
	};
