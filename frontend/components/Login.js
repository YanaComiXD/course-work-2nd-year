import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const register_page = () => {
        navigate('/register'); // Перенаправление на страницу регистрации
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        setError(''); // Сбрасываем предыдущие ошибки

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (response.ok) {
                localStorage.setItem('token', data.token); // Сохраняем токен
                localStorage.setItem('email', email); // Сохраняем электронную почту
                localStorage.setItem('userID', data.id);
                localStorage.setItem("username", data.username);
                setIsAuthenticated(true); // Обновляем состояние аутентификации
                navigate('/'); // Перенаправляем на главную страницу
            }
        else {
            setError(data.error || 'Ошибка входа'); // Устанавливаем сообщение об ошибке
            console.error('Ошибка входа:', data.error);
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="form-label">Email</label>
                <input
                    type="email"
                    className='form-control'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    id="email"
                />
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
            <div className='button-high'>
            <button className="btn btn-primary" onClick={register_page}>Зарегистрироваться!</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
