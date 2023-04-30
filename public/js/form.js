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
		if(!regName.test(name)) throw `Error: Invalid ${varName} given`;
        if(name.length < 2 || name.length > 25 ) throw `Error: Invalid ${varName} given`;		
		return name;
	}

    function checkPassword(password) {
		if((/\s/).test(password)) throw `Error: Invalid Password given`;
        if(!(/(?=.*\d)(?=.*[A-Z])(?=.*\W)/).test(password)) throw `Error: Invalid Password given`;
        if(password.length < 8) throw `Error: Invalid Password given`;		
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
		if (typeof num !== "number") throw "Error: Age must be a number";
		if (!Number.isInteger(num)) throw "Error: Age must be an integer";
		if (num < 18 || num > 120)
			throw "Error: You are too young or have provided a fake age";
		return num;
	}
  
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const settingsForm = document.getElementById("settings-form");

    if (registrationForm) {
  
      registrationForm.addEventListener('submit', (event) => {

        const firstNameInputElement = document.getElementById('firstNameInput');
        const lastNameInputElement = document.getElementById('lastNameInput');
        const emailAddressInputElement = document.getElementById('emailAddressInput');
        const passwordInputElement = document.getElementById('passwordInput');
        const confirmPasswordInputElement = document.getElementById('confirmPasswordInput');
        const ageInputElement = document.getElementById('ageInput');
        let errorDiv = document.getElementById('error');

        let ul = document.createElement('ul');
        errorDiv.hidden = true;
        errorDiv.innerHTML = '';
        let isError = false;

        try {
            var firstNameInputValue = firstNameInputElement.value;
            firstNameInputValue = checkString(firstNameInputValue, "First Name");
            firstNameInputValue = checkName(firstNameInputValue, "First Name");
        } catch (e) {
            isError = true;
            let li = document.createElement('li');
            li.innerHTML = e;
            ul.appendChild(li);
        }

        try {
            var lastNameInputValue = lastNameInputElement.value;
            lastNameInputValue = checkString(lastNameInputValue, "Last Name");
            lastNameInputValue = checkName(lastNameInputValue, "Last Name");
        } catch (e) {
            isError = true;
            let li = document.createElement('li');
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
            let li = document.createElement('li');
            li.innerHTML = e;
            ul.appendChild(li);
        }

        try {
            var passwordInputValue = passwordInputElement.value;
            passwordInputValue = checkString(passwordInputValue, "Password");
            passwordInputValue = checkPassword(passwordInputValue);
        } catch (e) {
            isError = true;
            let li = document.createElement('li');
            li.innerHTML = e;
            ul.appendChild(li);
        }

        try {
            var ageInputValue = parseInt(ageInputElement.value);
            ageInputValue = checkAge(ageInputValue);
        } catch (e) {
            isError = true;
            let li = document.createElement('li');
            li.innerHTML = e;
            ul.appendChild(li);
        }

        try {
            var confirmPasswordInputValue = confirmPasswordInputElement.value;
            confirmPasswordInputValue = checkString(confirmPasswordInputValue, "Confirm Password");
            if (confirmPasswordInputValue !== passwordInputValue) throw `Error: Password and Confirm Password do not match`;
        } catch (e) {
            isError = true;
            let li = document.createElement('li');
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
  
        loginForm.addEventListener('submit', (event) => {
  
          const emailAddressInputElement = document.getElementById('emailAddressInput');
          const passwordInputElement = document.getElementById('passwordInput');
          let errorDiv = document.getElementById('error');
  
          let ul = document.createElement('ul');
          errorDiv.hidden = true;
          errorDiv.innerHTML = '';
          let isError = false;
  
          try {
              var emailAddressInputValue = emailAddressInputElement.value;
              emailAddressInputValue = emailAddressInputValue.toLowerCase();
              emailAddressInputValue = checkString(emailAddressInputValue, "Email");
              emailAddressInputValue = checkEmail(emailAddressInputValue);
          } catch (e) {
              isError = true;
              let li = document.createElement('li');
              li.innerHTML = e;
              ul.appendChild(li);
          }
  
          try {
              var passwordInputValue = passwordInputElement.value;
              passwordInputValue = checkString(passwordInputValue, "Password");
              passwordInputValue = checkPassword(passwordInputValue);
          } catch (e) {
              isError = true;
              let li = document.createElement('li');
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

      if(settingsForm){
        settingsForm.addEventListener('submit', (event) => {

            let first = document.getElementById('firstNameInput');
            let last = document.getElementById('lastNameInput');
            let email = document.getElementById('emailInput');
            let age = document.getElementById('ageInput');
            // let oldPassword = document.getElementById('oldPasswordInput');
            // let newPassword = document.getElementById('newPasswordInput');
            let emptyError = document.getElementById('emptyError');
            let error1 = document.getElementById('error1');
            let error2 = document.getElementById('error2');
            let error3 = document.getElementById('error3');
            let error4 = document.getElementById('error4');
            // let error5 = document.getElementById('error5');
            // let error6 = document.getElementById('error6');

            let firstErr = false;
            let lastErr = false;
            let emailErr = false;
            let ageErr = false;
            first.value = first.value.trim();
            last.value = last.value.trim();
            email.value = email.value.trim();
            age.value = age.value.trim();
            if(first.value === "" && last.value === "" && email.value === "" && age.value === "" && oldPassword.value === "" && newPassword.value === ""){
                event.preventDefault();
                emptyError.hidden = false;
                
                error1.hidden = true;
                error2.hidden = true;
                error3.hidden = true;
                error4.hidden = true;
                // error5.hidden = true;
                // error6.hidden = true;
            }
            // if(!oldPassword){
            //     event.preventDefault()
            //     error5.hidden = false;
            // }
            if(first.value){
                try{
                    first.value = checkName(first.value, "First Name");
                    firstErr = false;
                }catch(e){
                    event.preventDefault();
                    first.value = "";
                    error1.hidden = false;
                    emptyError.hidden = true;
                    firstErr = true;

                    if(!last.value){error2.hidden = true};
                    if(!email.value){error3.hidden = true};
                    if(!age.value){error4.hidden = true};
                }
            }
            if(last.value){
                try{
                    last.value = checkName(last.value, "Last Name");
                    lastErr = false;
                }catch(e){
                    event.preventDefault();
                    last.value = "";
                    error2.hidden = false;
                    emptyError.hidden = true;
                    lastErr = true;

                    if(!first.value && firstErr === false){error1.hidden = true};
                    if(!email.value){error3.hidden = true};
                    if(!age.value){error4.hidden = true};
                }
            }
            if(email.value){
                try{
                    email.value = checkEmail(email.value, "Email");
                    emailErr = false;
                }catch(e){
                    event.preventDefault();
                    email.value = "";
                    error3.hidden = false;
                    emptyError.hidden = true;
                    if(!first.value && firstErr ===false){error1.hidden = true};
                    if(!last.value && lastErr === false){error2.hidden = true};
                    if(!age.value){error4.hidden = true};
                } 
            }
            let changeAge = 0;
            if(age.value){
                try{
                    changeAge = parseInt(age.value);
                    changeAge = checkAge(changeAge, "Age");
                    ageErr = false;
                }catch(e){
                    event.preventDefault();
                    age.value = "";
                    error4.hidden = false;
                    emptyError.hidden = true;
                    ageErr = true;
                    if(!first.value && firstErr === false){error1.hidden = true};
                    if(!last.value && lastErr === false){error2.hidden = true};
                    if(!email.value && emailErr === false){error3.hidden = true};
                }
            }
            
            if(first.value || last.value || email.value || age.value){
                emptyError.hidden = true;
            }

        }  ); 
      }
  })();