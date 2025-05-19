// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './card_design.css';

const Header = ({ onLogout }) => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout(); // Вызов функции onLogout для обновления состояния
        navigate('/login'); // Перенаправление на страницу входа
    };
  
    const handleProfile = () => {
        navigate('/profile');
    };
  
    return (
        <header className="my-4">
            <div className="float-right">
                <button className='btn btn-primary' onClick={handleProfile}>Мой профиль</button>
                <div className='button-gap'>
                <button className="btn btn-primary" onClick={handleLogout}>Выйти</button>
                </div>
            </div>
            <h1>~Мой WishList~</h1>
        </header>
    );
};

export default Header;
