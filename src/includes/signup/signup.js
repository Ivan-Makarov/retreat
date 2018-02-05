export default (formQS) => {
	const form = document.querySelector(formQS);	
	validate(form);

	function validate(form) {
		const submitBtn = form.querySelector('button');
		const inputs = [...form.querySelectorAll('input')];
		const inputsCount = inputs.length;
		let validInputs = [];

		inputs.forEach(input => {
			input.addEventListener('input', checkValidityInput)
		})

		inputs.forEach(input => {
			input.addEventListener('blur', checkValidityBlur)
		})

		function checkValidityBlur(e) {
			const input = e.currentTarget; 
				
			if (!input.dataset.touched) {
				if (!isValid(input)) {
					input.classList.add('invalid');
				}
				input.dataset.touched = true;
			}

			if (isValid(input)) {
				input.classList.add('valid')
			}
		}

		function checkValidityInput(e) {
			const input = e.currentTarget;

			if (isValid(input) && !isIn(validInputs, input)) {
				validInputs.push(input)
				if (input.classList.contains('invalid')) {
					input.classList.remove('invalid')
				}
				if (formReady()) {
					checkSubmit(form, submitBtn, true)
				}
			} else if (!isValid(input) && isIn(validInputs, input)) {
				if (formReady()) {
					checkSubmit(form, submitBtn, false)
				}
				rmFrom(validInputs, input);
				if (input.dataset.touched && !input.classList.contains('invalid')) {
					input.classList.add('invalid')
				}
			}
		}

		function isValid(input) {
			switch(input.name) {
				case 'name':
					return input.value.length > 0
					break
				case 'contact':
					const emailRegEx = /\S+@\S+\.\S{2,}/;
					const phoneRegEx = /\+?\d{11,}/;
					const phoneChars = /[()\s-]/g;

					function isEmail(item) {
						return item.match(emailRegEx)
					}

					function isPhone(item) {
						return item.replace(phoneChars, '').match(phoneRegEx)
					}

					return isPhone(input.value) || isEmail(input.value)
					break
				default:
					return true
			}
		}

		function formReady() {
			return inputsCount === validInputs.length
		}		
	}
	
	function checkSubmit(form, btn, ready) {
		if (ready) {
			btn.classList.add('active')
			btn.disabled = false;
			btn.addEventListener('click', prepSubmit);
			btn.textContent = "Отправить заявку";
		} else {
			btn.classList.remove('active');
			btn.disabled = true;
			btn.removeEventListener('click', prepSubmit)
			btn.textContent = "Заполните форму, чтобы отправить заявку";
		}

		function prepSubmit(e) {
			e.preventDefault();
			e.currentTarget.classList.add('sending');
			e.currentTarget.textContent = 'Обрабатываем заявку';
			const formData = new FormData(form);
			submit(formData, form);
		}
	}

	function submit(data, form) {
		const msg = document.querySelector('.submit-msg');

		fetch('/formhandler.php', {
			body: data, 
			method: 'POST',
		}) 
		.then((res) => {
			return res.text()	
		})
		.then((res) => {
			console.log(res);
			res ? showSubmission(form, msg) : showErr(form, msg)
		})
		.catch((err) => {
			showErr(from, msg);
		});
	}

	function showSubmission(form, msg) {
		if (msg.classList.contains('hidden')) {
			msg.classList.remove('hidden');
		}
		form.classList.add('hidden');
		msg.textContent = 'Спасибо, мы свяжемся с вами в течение суток.';
	}

	function showErr(form, msg) {
		msg.classList.add('err');
		msg.classList.remove('hidden');
		msg.textContent = 'Что-то пошло не так. Попробуйте еще раз или свяжитесь со нами по телефону или по электронной почте';
		form.classList.add('hidden');
		form.querySelector('button').classList.remove('sending');
		form.querySelector('button').textContent = "Отправить заявку";
		setTimeout(() => {
			msg.classList.add('hidden')
			form.classList.remove('hidden');
		}, 5000)
	}

	function isIn(arr, item) {
		return arr.find(el => {
			return el == item
		})
	}

	function rmFrom(arr, item) {
		arr.splice(arr.findIndex(el => {
			return el == item
		}), 1)
	}
}

