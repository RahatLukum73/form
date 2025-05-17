import { useState, useRef } from 'react';
import styles from './App.module.css';

const initialState = {
	email: '',
	password: '',
	confirmPassword: '',
};

const useStore = () => {
	const [state, setState] = useState(initialState);

	return {
		getState: () => state,
		updateState: (fieldName, newValue) => {
			setState({ ...state, [fieldName]: newValue })
		},
	}
};

const sendData = (formData) => {
	console.log(formData);
};

export const App = () => {
	const { getState, updateState } = useStore();
	const [errors, setErrors] = useState({
		email: null,
		password: null,
		confirmPassword: null,
	});
	const [fieldTouched, setFieldTouched] = useState({
		email: false,
		password: false,
		confirmPassword: false,
	});

	const { email, password, confirmPassword } = getState();

	const validateEmail = (email) => {
		if (!email) return 'Email обязателен';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Введите корректный email';
		if (email.length > 20) return 'Максимальная длина 20 символов';
		return null;
	};

	const validatePassword = (password) => {
		if (!password) return 'Пароль обязателен';
		if (password.length < 8) return 'Минимум 8 символов';
		if (!/[A-Z]/.test(password)) return 'Должна быть заглавная буква';
		if (!/[a-z]/.test(password)) return 'Должна быть строчная буква';
		if (!/\d/.test(password)) return 'Должна быть цифра';
		return null;
	};

	const validateConfirmPassword = (confirmPassword) => {
		if (password !== confirmPassword) return 'Пароли не совпадают';
		return null;
	};

	const submitButtonRef = useRef(null);

	const handleChange = ({ target }) => {
		updateState(target.name, target.value);
		if (target.name === 'confirmPassword') {
			if (fieldTouched.confirmPassword) {
				const error = validateConfirmPassword(target.value);
				setErrors({ ...errors, confirmPassword: error });
			}
			if (password === target.value && !validateEmail(email) && !validatePassword(password)) {
				setTimeout(() => {
					submitButtonRef.current.focus();
				}, 10);
			}
		}
	};

	const handleBlur = (fieldName) => {
		setFieldTouched({ ...fieldTouched, [fieldName]: true });

		if (fieldName === 'email') {
			setErrors({ ...errors, email: validateEmail(email) });
		} else if (fieldName === 'password') {
			setErrors({
				...errors,
				password: validatePassword(password),
			});
		} else if (fieldName === 'confirmPassword') {
			setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword) });
		}
	};

	const onSubmit = (event) => {
		event.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);
		const confirmPasswordError = validateConfirmPassword(confirmPassword);

		setErrors({
			email: emailError,
			password: passwordError,
			confirmPassword: confirmPasswordError
		});

		if (!emailError && !passwordError && !confirmPasswordError) {
			submitButtonRef.current.focus();
			sendData(getState());
		}
	};

	const isFormValid = !errors.email && !errors.password && !errors.confirmPassword;

	return (
		<div className={styles.app}>
			<form className={styles.form} onSubmit={onSubmit}>
				<p>Форма с использованием: <br />useState, useRef.</p>
				<input
					type="email"
					name="email"
					value={email}
					placeholder="Почта"
					onChange={({ target }) => updateState(target.name, target.value)}
					onBlur={() => handleBlur('email')}
				/>
				<div className={styles.errorLabel}>{errors.email}</div>
				<input
					type="password"
					name="password"
					value={password}
					placeholder="Введите пароль"
					onChange={({ target }) => updateState(target.name, target.value)}
					onBlur={() => handleBlur('password')}
				/>
				<div className={styles.errorLabel}>{errors.password}</div>
				<input
					type="password"
					name="confirmPassword"
					value={confirmPassword}
					placeholder="Повторите пароль"
					onChange={handleChange}
					onBlur={() => handleBlur('confirmPassword')}
				/>
				<div className={styles.errorLabel}>{errors.confirmPassword}</div>
				<button ref={submitButtonRef} type="submit" disabled={!isFormValid}>Зарегистрироваться</button>
			</form>
		</div>
	)
};