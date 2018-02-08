import data from '../../../data';
import Inputmask from "inputmask";


export default (formQS) => {
	const form = document.querySelector(formQS);	
	bindInputsAndLabels(form);
	validate(form);
	bindCbAndItem('[name="been-before"][value="Да"]', '#before-details');
	maskTel(form);

	saveUserInput(form);
	restoreUserInput(form);

	function maskTel(form) {
		const telMask = new Inputmask("+7(999)999-99-99");
		telMask.mask(form.querySelector('[name="tel"]'));
	}

	function bindInputsAndLabels(form) {
		const cbs = [...form.querySelectorAll('.cb')];
		cbs.forEach(bindLabel);

		const radios = [...form.querySelectorAll('.radio')];
		radios.forEach(bindLabel);

		function bindLabel(item) {
			const label = item.id ? form.querySelector(`[for=${item.id}].js-label`) : item.parentElement		
			item.addEventListener('change', () => {
				checkLabel(item, label)
			})	
		}

		function checkLabel(item, label) {
			if (item.checked) {
				const allLabels = [...document.querySelectorAll(`[data-group="${label.dataset.group}"]`)];
				allLabels.forEach(uncheckItem);
				checkItem(label);
			} else {
				uncheckItem(label)
			}
		}

		function checkItem(item) {
			item.classList.add('checked')
		}

		function uncheckItem(item) {
			item.classList.remove('checked')
		}	
	}

	function bindCbAndItem(cbqs, itemqs) {
		const cb = form.querySelector(cbqs);
		const item = form.querySelector(itemqs);

		cb.addEventListener('change', () => {
			showOnChecked(cb, item)
		})
	}

	function showOnChecked(cb, item) {
		if (cb.checked) {
			item.classList.remove('hidden');
		} else {
			item.classList.add('hidden');
		}
	}

	function validate(form) {
		const submitBtn = form.querySelector('button');
		const inputs = [...form.querySelectorAll('input')].reduce(toRequired, []);
		const inputsCount = inputs.length;
		let validInputs = [];

		function toRequired(required, item) {
			if (isIn(data.required, item.name)) {
				required.push(item);
				return required
			} else {
				return required
			}
		}

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
			const emailRegEx = /\S+@\S+\.\S{2,}/;
			const phoneRegEx = /\+?\d{11,}/;
			const phoneChars = /[()\s-]/g;

			function isEmail(item) {
				return item.match(emailRegEx)
			}

			function isPhone(item) {
				return item.replace(phoneChars, '').match(phoneRegEx)
			}
			
			switch(input.name) {
				case 'name':
					return input.value.split(' ').length > 1 && input.value.split(' ')[1] != ''  
					break
				case 'email':
					return isEmail(input.value);
					break
				case 'tel':
					return isPhone(input.value)
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
		msg.textContent = 'Спасибо, мы свяжемся с вами в течение суток. Через несколько секунд вы сможете отправить еще одну форму.';
		form.querySelector('button').classList.remove('sending');
		form.querySelector('button').textContent = "Отправить заявку";		
		setTimeout(() => {
			msg.classList.add('hidden')
			form.classList.remove('hidden');
		}, 5000);
		clearField(form.querySelector('[name="name"]'))
		clearField(form.querySelector('[name="email"]'))
		clearField(form.querySelector('[name="tel"]'))				
	}

	function showErr(form, msg) {
		msg.classList.add('err');
		msg.classList.remove('hidden');
		msg.textContent = 'Что-то пошло не так. Попробуйте еще раз или свяжитесь с нами по телефону или поэлектронной почте';
		form.classList.add('hidden');
		form.querySelector('button').classList.remove('sending');
		form.querySelector('button').textContent = "Отправить заявку";
		setTimeout(() => {
			msg.classList.add('hidden')
			form.classList.remove('hidden');
		}, 5000)
	}

	function clearField(field) {
		field.value = "";
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

	function saveUserInput(form) {
		form.addEventListener('input', () => {
			saveInput(form)
		});

		form.addEventListener('change', () => {
			saveInput(form)
		});
		

		function saveInput(form) {
			const json = jsonifyFormData(form)
			localStorage.setItem('data', json)
		}
	}

	function restoreUserInput(form) {
		const inputs = [...form.querySelectorAll('input, textarea, select')];
		
		if (localStorage.data) {
			const data = JSON.parse(localStorage.data);
			restoreValues(inputs, data);
		}

		function restoreValues(inputs, data) {
			inputs.forEach(input => {
				const value = data[input.name];
				
				const changeEvent = new Event('change', {
					'bubbles': true,
					'cancelable': true
				});				
				const inputEvent = new Event('input', {
					'bubbles': true,
					'cancelable': true
				});

				if (value) {
					if (input.tagName === 'SELECT') {
						input.value = value;
						input.dispatchEvent(changeEvent)								
					} else {
						
						switch(input.type) {
							case 'radio':
								console.log(value);
								const label = form.querySelector(`[data-for="${value}"]`);
								console.log(label);
								label ? label.click() : input.click();
								break;
							case 'checkbox':
								if (value == input.value) {									
									const label = form.querySelector(`[for=${input.id}]`);
									label ? label.click() : input.click();	
								}
								break;
							case 'hidden':
								break
							default:
								input.value = value;
								input.dispatchEvent(inputEvent)
								break
						}						
					}
				}
			})
		}
	}

	function jsonifyFormData(form) {
		const formData = new FormData(form);

		function toObject(object, [key, value]) {
			object[key] = value;
			return object
		}

		const dataObject = [...formData].reduce(toObject, {})

		return JSON.stringify(dataObject) 
	}
	
}

