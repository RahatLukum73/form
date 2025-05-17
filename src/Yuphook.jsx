import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRef } from 'react';
import styles from './App.module.css';

const scheme = yup.object().shape({
	email: yup
		.string()
		.required('Email обязателен!')
		.email('Введите корректный email!')
		.max(20, 'Максимальная длина 20 символов!'),
	password: yup
		.string()
		.required('Email обязателен!')
		.min(8, 'Минимум 8 символов!')
		.matches(/[A-Z]/, 'Должна быть заглавная буква')
		.matches(/[a-z]/, 'Должна быть строчная буква')
		.matches(/\d/, 'Должна быть цифра!'),
	confirmPassword: yup
		.string()
		.required('Подтвердите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают')
});

export const Yuphook = () => {
	const submitButtonRef = useRef(null);
	const formRef = useRef(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		mode: 'onChange',
		resolver: yupResolver(scheme)
	});

	const password = watch('password');
	const confirmPassword = watch('confirmPassword');

	const handleConfirmPasswordKeyUp = () => {
		if (password === confirmPassword && isValid && submitButtonRef.current) {
			submitButtonRef.current.focus();
		}
	};


	const onSubmit = (formData) => {
		console.log(formData);
	};

	return (
		<div className={styles.app}>
			<form className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
				ref={formRef}
			>
				<p>Форма с использованием: <br />useRef, useForm,<br /> yupResolver и yup.</p>
				<input
					type="email"
					placeholder="Почта"
					{...register('email')}
				/>
				{errors.email && (<div className={styles.errorLabel}>{errors.email.message}</div>)}
				<input
					type="password"
					placeholder="Введите пароль"
					{...register('password')}
				/>
				{errors.password && (<div className={styles.errorLabel}>{errors.password.message}</div>)}
				<input
					type="password"
					placeholder="Повторите пароль"
					{...register('confirmPassword')}
					onKeyUp={handleConfirmPasswordKeyUp}
				/>
				{errors.confirmPassword && (<div className={styles.errorLabel}>{errors.confirmPassword.message}</div>)}
				<button
					ref={submitButtonRef}
					type="submit"
					disabled={!isValid}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	)
};