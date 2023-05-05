(function () {
	function checkString(strVal, varName) {
		if (!strVal) throw `Error: You must supply a ${varName}!`;
		if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
		if (varName.toLowerCase().trim() !== "password") {
			strVal = strVal.trim();
		}
		if (strVal.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		if (!isNaN(strVal))
			throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
		return strVal;
	}

	function checkName(name, varName) {
		var regName = /^[a-z'-]+$/i;
		if (!regName.test(name)) throw `Error: Invalid ${varName} given`;
		if (name.length < 2 || name.length > 25)
			throw `Error: Invalid ${varName} given`;
		return name;
	}

	function checkPassword(password) {
		if (/\s/.test(password)) throw `Error: Invalid Password given`;
		if (!/(?=.*\d)(?=.*[A-Z])(?=.*\W)/.test(password))
			throw `Error: Invalid Password given`;
		if (password.length < 8) throw `Error: Invalid Password given`;
		return password;
	}

	function checkEmail(email) {
		if (!email) throw "Error: You must provide an email";
		if (typeof email !== "string") throw "Error: Email must be a string";
		email = email.trim();
		if (email.length === 0)
			throw "Error: Email must be more than an empty string";
		let at = email.indexOf("@");
		let end = email.indexOf(".");
		if (!(at < end)) throw `Error: Not a valid email`;
		if (at === -1 || end === -1) throw `Error: Not a valid email`;
		let emailEnd = email.slice(-4);
		if (
			emailEnd !== ".com" &&
			emailEnd !== ".net" &&
			emailEnd !== ".edu" &&
			emailEnd !== ".gov" &&
			emailEnd !== ".org"
		)
			throw "Error: You must provide a valid email";
		return email;
		/* Do we want to use this email validator instead?
		var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!regEmail.test(email)) throw `Error: Invalid Email given`;
		return email;
		*/
	}

	function checkAge(num) {
		if (!num) throw "Error: You must supply an age";
		if (typeof num != "number") throw "Error: Age must be a number";
		if (!Number.isInteger(num)) throw "Error: Age must be an integer";
		if (num < 18 || num > 120)
			throw "Error: You are too young or have provided a fake age";
		return num;
	}
	function checkStringArray(arr, varName, minLength) {
		if (!arr || !Array.isArray(arr))
			throw `Error: You must provide an array of ${varName}`;
		if (arr.length < minLength)
			throw `Error: ${varName} must have at least ${minLength} element(s)`;
		for (let i in arr) {
			if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
				throw `Error: One or more elements in ${varName} array is not a string or is an empty string`;
			}
			arr[i] = arr[i].trim();
		}
		return arr;
	}
	function checkWeight(weight, varName) {
		if (weight !== undefined) throw `Error: You must supply a ${varName}!`;
		if (typeof weight !== "number") throw `Error: ${varName} must be a number!`;
		if (weight < 0) throw `Error: ${varName} cannot be less than 0`;
		weight = weight.toFixed(1);
		return weight;
	}

	const registrationForm = document.getElementById("registration-form");
	const loginForm = document.getElementById("login-form");
	const settingsForm = document.getElementById("settings-form");
	const appForm = document.getElementById("application-form");
	const quizForm = document.getElementById("quiz-form");
	const filterForm = document.getElementById("filter-form");

	if (registrationForm) {
		registrationForm.addEventListener("submit", (event) => {
			const firstNameInputElement = document.getElementById("firstNameInput");
			const lastNameInputElement = document.getElementById("lastNameInput");
			const emailAddressInputElement =
				document.getElementById("emailAddressInput");
			const passwordInputElement = document.getElementById("passwordInput");
			const confirmPasswordInputElement = document.getElementById(
				"confirmPasswordInput"
			);
			const ageInputElement = document.getElementById("ageInput");
			let errorDiv = document.getElementById("error");

			let ul = document.createElement("ul");
			errorDiv.hidden = true;
			errorDiv.innerHTML = "";
			let isError = false;

			try {
				var firstNameInputValue = firstNameInputElement.value;
				firstNameInputValue = checkString(firstNameInputValue, "First Name");
				firstNameInputValue = checkName(firstNameInputValue, "First Name");
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				var lastNameInputValue = lastNameInputElement.value;
				lastNameInputValue = checkString(lastNameInputValue, "Last Name");
				lastNameInputValue = checkName(lastNameInputValue, "Last Name");
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				var emailAddressInputValue = emailAddressInputElement.value;
				emailAddressInputValue = emailAddressInputValue.toLowerCase();
				emailAddressInputValue = checkString(emailAddressInputValue, "Email");
				emailAddressInputValue = checkEmail(emailAddressInputValue);
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				var passwordInputValue = passwordInputElement.value;
				passwordInputValue = checkString(passwordInputValue, "Password");
				passwordInputValue = checkPassword(passwordInputValue);
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				// var ageInputValue = parseInt(ageInputElement.value);
				let age = parseInt(ageInputElement.value);
				age = checkAge(age);
				//ageInputValue = checkAge(ageInputValue);
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				var confirmPasswordInputValue = confirmPasswordInputElement.value;
				confirmPasswordInputValue = checkString(
					confirmPasswordInputValue,
					"Confirm Password"
				);
				if (confirmPasswordInputValue !== passwordInputValue)
					throw `Error: Password and Confirm Password do not match`;
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			if (isError == true) {
				event.preventDefault();
				errorDiv.appendChild(ul);
				errorDiv.hidden = false;
			}
		});
	}

	if (loginForm) {
		loginForm.addEventListener("submit", (event) => {
			const emailAddressInputElement =
				document.getElementById("emailAddressInput");
			const passwordInputElement = document.getElementById("passwordInput");
			let errorDiv = document.getElementById("error");

			let ul = document.createElement("ul");
			errorDiv.hidden = true;
			errorDiv.innerHTML = "";
			let isError = false;

			try {
				var emailAddressInputValue = emailAddressInputElement.value;
				emailAddressInputValue = emailAddressInputValue.toLowerCase();
				emailAddressInputValue = checkString(emailAddressInputValue, "Email");
				emailAddressInputValue = checkEmail(emailAddressInputValue);
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			try {
				var passwordInputValue = passwordInputElement.value;
				passwordInputValue = checkString(passwordInputValue, "Password");
				passwordInputValue = checkPassword(passwordInputValue);
			} catch (e) {
				isError = true;
				let li = document.createElement("li");
				li.innerHTML = e;
				ul.appendChild(li);
			}

			if (isError == true) {
				event.preventDefault();
				errorDiv.appendChild(ul);
				errorDiv.hidden = false;
			}
		});
	}

	if (settingsForm) {
		settingsForm.addEventListener("submit", (event) => {
			let first = document.getElementById("firstNameInput");
			let last = document.getElementById("lastNameInput");
			let email = document.getElementById("emailInput");
			let age = document.getElementById("ageInput");
			let oldPassword = document.getElementById("oldPasswordInput");
			let newPassword = document.getElementById("newPasswordInput");
			let emptyError = document.getElementById("emptyError");
			let error1 = document.getElementById("error1");
			let error2 = document.getElementById("error2");
			let error3 = document.getElementById("error3");
			let error4 = document.getElementById("error4");
			let error5 = document.getElementById("error5");
			let error6 = document.getElementById("error6");

			let firstErr = false;
			let lastErr = false;
			let emailErr = false;
			let ageErr = false;
			let passErr = false;
			first.value = first.value.trim();
			last.value = last.value.trim();
			email.value = email.value.trim();
			age.value = age.value.trim();
			oldPassword.value = oldPassword.value.trim();
			newPassword.value = newPassword.value.trim();

			if (
				first.value === "" &&
				last.value === "" &&
				email.value === "" &&
				age.value === "" &&
				newPassword.value === ""
			) {
				event.preventDefault();
				emptyError.hidden = false;

				error1.hidden = true;
				error2.hidden = true;
				error3.hidden = true;
				error4.hidden = true;
				error5.hidden = true;
				error6.hidden = true;
			}
			if (!oldPassword.value) {
				event.preventDefault();
				error5.hidden = false;
			}
			if (first.value) {
				try {
					first.value = checkName(first.value, "First Name");
					firstErr = false;
				} catch (e) {
					event.preventDefault();
					first.value = "";
					error1.hidden = false;
					emptyError.hidden = true;
					firstErr = true;

					if (!last.value) {
						error2.hidden = true;
					}
					if (!email.value) {
						error3.hidden = true;
					}
					if (!age.value) {
						error4.hidden = true;
					}
					if (!newPassword.value) {
						error6.hidden = true;
					}
				}
			}
			if (last.value) {
				try {
					last.value = checkName(last.value, "Last Name");
					lastErr = false;
				} catch (e) {
					event.preventDefault();
					last.value = "";
					error2.hidden = false;
					emptyError.hidden = true;
					lastErr = true;

					if (!first.value && firstErr === false) {
						error1.hidden = true;
					}
					if (!email.value) {
						error3.hidden = true;
					}
					if (!age.value) {
						error4.hidden = true;
					}
					if (!newPassword.value) {
						error6.hidden = true;
					}
				}
			}
			if (email.value) {
				try {
					email.value = checkEmail(email.value, "Email");
					emailErr = false;
				} catch (e) {
					event.preventDefault();
					email.value = "";
					error3.hidden = false;
					emptyError.hidden = true;
					if (!first.value && firstErr === false) {
						error1.hidden = true;
					}
					if (!last.value && lastErr === false) {
						error2.hidden = true;
					}
					if (!age.value) {
						error4.hidden = true;
					}
					if (!newPassword.value) {
						error6.hidden = true;
					}
				}
			}
			let changeAge = 0;
			if (age.value) {
				try {
					changeAge = parseInt(age.value);
					changeAge = checkAge(changeAge, "Age");
					ageErr = false;
				} catch (e) {
					event.preventDefault();
					age.value = "";
					error4.hidden = false;
					emptyError.hidden = true;
					ageErr = true;
					if (!first.value && firstErr === false) {
						error1.hidden = true;
					}
					if (!last.value && lastErr === false) {
						error2.hidden = true;
					}
					if (!email.value && emailErr === false) {
						error3.hidden = true;
					}
					if (!newPassword.value) {
						error6.hidden = true;
					}
				}
			}
			if (newPassword.value) {
				try {
					newPassword.value = checkPassword(newPassword.value, "New Password");
					console.log(newPassword.value);
					passErr = false;
				} catch (e) {
					newPassword.value = "";
					error6.hidden = false;
					emptyError.hidden = true;
					passErr = true;
					if (!first.value && firstErr === false) {
						error1.hidden = true;
					}
					if (!last.value && lastErr === false) {
						error2.hidden = true;
					}
					if (!email.value && emailErr === false) {
						error3.hidden = true;
					}
				}
			}
			if (first.value || last.value || email.value || age.value || newPassword.value) {
				emptyError.hidden = true;
			}
		});
	}
	if (appForm) {
		appForm.addEventListener("submit", (event) => {
			let firstNameInput = document.getElementById("firstNameInput");
			let lastNameInput = document.getElementById("lastNameInput");
			let emailInput = document.getElementById("emailInput");
			let ageInput = document.getElementById("ageInput");
			let age;
			let phoneInput = document.getElementById("phoneInput");
			let livingAccommodationsInput = document.getElementById(
				"livingAccommodationsInput"
			);
			let childrenInput = document.getElementById("childrenInput");
			let timeAloneInput = document.getElementById("timeAloneInput");
			let animalsInput = document.getElementById("animalsInput");
			let yardInput = document.getElementById("yardInput");
			let reasoningInput = document.getElementById("reasoningInput");
			let error = document.getElementById("error");

			//ADDING THIS STUFF TO DRAW EYES TO ERROR
			let firstErr = document.getElementById("first");
			let lastErr = document.getElementById("last");
			let emailErr = document.getElementById("email");
			let ageErr = document.getElementById("age");
			let phoneErr = document.getElementById("phone");
			let accommodationsErr = document.getElementById("accommodations");
			let childrenErr = document.getElementById("children");
			let timeAloneErr = document.getElementById("timeAlone");
			let animalsErr = document.getElementById("animals");
			let yardErr = document.getElementById("yard");
			let reasoningErr = document.getElementById("reasoning");
			error.hidden = true;

			firstErr.className = "";
			lastErr.className = "";
			emailErr.className = "";
			ageErr.className = "";
			phoneErr.className = "";
			accommodationsErr.className = "";
			childrenErr.className = "";
			timeAloneErr.className = "";
			animalsErr.className = "";
			yardErr.className = "";
			reasoningErr.className = "";

			try {
				firstNameInput.value = checkName(firstNameInput.value, "First Name");
			} catch (e) {
				firstNameInput.value = "";
				event.preventDefault();
				error.hidden = false;
				firstErr.className = "error";
			}
			try {
				lastNameInput.value = checkName(lastNameInput.value, "Last Name");
			} catch (e) {
				lastNameInput.value = "";
				event.preventDefault();
				error.hidden = false;
				lastErr.className = "error";
			}
			try {
				emailInput.value = checkEmail(emailInput.value, "Email");
			} catch (e) {
				emailInput.value = "";
				event.preventDefault();
				error.hidden = false;
				emailErr.className = "error";
			}
			try {
				age = parseInt(ageInput.value.trim());
				age = checkAge(age, "Age");
			} catch (e) {
				ageInput.value = "";
				event.preventDefault();
				error.hidden = false;
				ageErr.className = "error";
			}
			try {
				phoneInput.value = phoneInput.value.trim();
				if (phoneInput.value === "") throw "invalid phone number";

				phoneInput.value.match("[0-9]{3}-[0-9]{3}-[0-9]{4}");
			} catch (e) {
				phoneInput.value = "";
				event.preventDefault();
				error.hidden = false;
				phoneErr.className = "error";
			}
			try {
				livingAccommodationsInput.value = livingAccommodationsInput.value
					.trim()
					.toLowerCase();
				if (
					livingAccommodationsInput.value != "home" &&
					livingAccommodationsInput.value != "apartment" &&
					livingAccommodationsInput.value != "townhouse" &&
					livingAccommodationsInput.value != "other"
				)
					throw `Invalid living accomodation`;
			} catch (e) {
				livingAccommodationsInput.value = "";
				event.preventDefault();
				error.hidden = false;
				accommodationsErr.className = "error";
			}
			try {
				childrenInput.value = childrenInput.value.trim().toLowerCase();
				if (
					childrenInput.value != "0" &&
					childrenInput.value != "1" &&
					childrenInput.value != "2" &&
					childrenInput.value != "3" &&
					childrenInput.value != "more than 3"
				)
					throw `invalid value for children`;
			} catch (e) {
				childrenInput.value = "";
				event.preventDefault();
				error.hidden = false;
				childrenErr.className = "error";
			}

			try {
				timeAloneInput.value = timeAloneInput.value.trim();
				if (!timeAloneInput.value) throw `cannot be empty`;
				let num = parseInt(timeAloneInput.value);
				if (num < 0 || num > 24) throw `invalid time to be alone`;
			} catch (e) {
				timeAloneInput.value = "";
				event.preventDefault();
				error.hidden = false;
				timeAloneErr.className = "error";
			}
			try {
				animalsInput.value = animalsInput.value.trim().toLowerCase();
				if (
					animalsInput.value != "0" &&
					animalsInput.value != "1" &&
					animalsInput.value != "2" &&
					animalsInput.value != "3" &&
					animalsInput.value != "more than 3"
				)
					throw `invalid value for animals`;
			} catch (e) {
				animalsInput.value = "";
				event.preventDefault();
				error.hidden = false;
				animalsErr.className = "error";
			}

			try {
				yardInput.value = yardInput.value.trim().toLowerCase();
				if (yardInput.value != "yes" && yardInput.value != "no")
					throw `invalid value for yard`;
			} catch (e) {
				yardInput.value = "";
				event.preventDefault();
				error.hidden = false;
				yardErr.className = "error";
			}

			try {
				reasoningInput.value = checkString(reasoningInput.value, "Reasoning");
			} catch (e) {
				reasoningInput.value = "";
				event.preventDefault();
				error.hidden = false;
				reasoningErr.className = "error";
			}
		});
	}
	if (quizForm) {
		quizForm.addEventListener("submit", (event) => {
			let space = document.getElementById("space");
			let walks = document.getElementById("walks");
			let outside = document.getElementById("outside");
			let fur = document.getElementById("fur");
			let size = document.getElementById("size");
			let activity = document.getElementById("activity");
			let fam = document.getElementById("fam");
			let dog = document.getElementById("dog");
			let error = document.getElementById("error");
			error.hidden = true;
			try {
				space.value = space.value.trim();
				if (
					space.value != "apartment" &&
					space.value != "houseB" &&
					space.value != "houseN"
				)
					throw `invalid space input`;
			} catch (e) {
				space.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				walks.value = walks.value.toLowerCase().trim();
				if (
					walks.value != "none" &&
					walks.value != "short" &&
					walks.value != "long" &&
					walks.value != "many"
				)
					throw `invalid walks input`;
			} catch (e) {
				walks.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				outside.value = outside.value.toLowerCase().trim();
				if (
					outside.value != "inside" &&
					outside.value != "out" &&
					outside.value != "both"
				)
					throw `invalid outside input`;
			} catch (e) {
				outside.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				fur.value = fur.value.toLowerCase().trim();
				if (
					fur.value != "noshed" &&
					fur.value != "shed" &&
					fur.value != "bothshed"
				)
					throw `invalid shed input`;
			} catch (e) {
				fur.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				size.value = size.value.toLowerCase().trim();
				if (
					size.value != "mini" &&
					size.value != "small" &&
					size.value != "medium" &&
					size.value != "large" &&
					size.value != "xlarge"
				)
					throw `invalid size input`;
			} catch (e) {
				size.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				activity.value = activity.value.toLowerCase().trim();
				if (
					activity.value != "lazy" &&
					activity.value != "physical" &&
					activity.value != "activityboth"
				)
					throw `invalid activity input`;
			} catch (e) {
				size.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				fam.value = fam.value.toLowerCase().trim();
				if (fam.value != "me" && fam.value != "nokid" && fam.value != "kid")
					throw `invalid family input`;
			} catch (e) {
				size.value = "";
				event.preventDefault();
				error.hidden = false;
			}
			try {
				dog.value = dog.value.toLowerCase().trim();
				if (
					dog.value != "working" &&
					dog.value != "herding" &&
					dog.value != "hound" &&
					dog.value != "sporting" &&
					dog.value != "nonsporting" &&
					dog.value != "toy" &&
					dog.value != "terrier"
				)
					throw `invalid dog input`;
			} catch (e) {
				size.value = "";
				event.preventDefault();
				error.hidden = false;
			}
		});
	}
	if (filterForm) {
		filterForm.addEventListener("submit", (event) => {
			let sexInput = document.getElementById("sexinput");
			let colorInput = document.getElementById("colorinput");
			let breedInput = document.getElementById("breedinput");
			let weightInput = document.getElementById("weightinput");
			let minWeight = document.getElementById("minweight");
			let maxWeight = document.getElementById("maxweight");
			let error = document.getElementById("error");
			error.hidden = true;
			let min = parseInt(minWeight.value);
			let max = parseInt(maxWeight.value);
			if (min > max) {
				event.preventDefault();
				error.hidden = false;
			}
		});
	}
})();
