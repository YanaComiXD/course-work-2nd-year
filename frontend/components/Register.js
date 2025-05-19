// components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './card_design.css';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login_path = async(e) =>
    {
        navigate('/login');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password,
            });

            console.log('Пользователь зарегистрирован:', response.data);
            // Перенаправление на страницу входа после успешной регистрации
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при регистрации:', err.response?.data?.error || err.message);
            setError(err.response?.data?.error || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="container">
            <h2>Регистрация</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                
                    <label htmlFor="username" className="form-label">Имя пользователя</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
            </form>
            <button onClick={login_path} className="btn btn-primary">Авторизироваться!</button>
        </div>
    );
};
export default Register;
