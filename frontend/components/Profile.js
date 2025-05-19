import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import './card_design.css';

const Profile = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Пользователь не найден.');
            setLoading(false);
            return;
        }

        // Здесь вы можете добавить дополнительные проверки или загрузку данных профиля

        setLoading(false); // Устанавливаем состояние загрузки в false, когда проверка завершена
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); // Перенаправление на страницу входа
    };

    const handleMain = () => {
        navigate('/');
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const IDID = localStorage.getItem('userID');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    return (
        <div>
            <h1>Профиль пользователя</h1>
            <div>
                <p><strong>ID:</strong> {IDID}</p>
                <p><strong>Имя:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
            </div>
            <button className='btn btn-primary' onClick={handleMain}>Перейти на главную страницу</button>
            <div className='button-high'>
                <button className='btn btn-primary' onClick={handleLogout}>Выйти</button>
            </div>
            <Cart/>
        </div>
    );
};

export default Profile;
