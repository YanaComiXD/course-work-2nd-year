// src/components/Cart.js
import React, { useEffect, useState } from 'react';
import './card_design.css';

const userId = localStorage.getItem('userID');
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                console.error('Ошибка при получении плейлиста');
            }
        };

        fetchCartItems();
    }, [userId]);

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                // Обновляем корзину, если товар был успешно удалён
                setCartItems(cartItems.filter(item => item.product_id !== productId));
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Ошибка при удалении песни');
            }
        } catch (error) {
            console.error('Ошибка при удалении песни:', error);
            alert('Ошибка при удалении песни');
        }
    };    
    return (
        <div className="cart">
            <h2>Ваш плейлист</h2>
            {cartItems.length === 0 ? (
                <p>Плейлист пуст</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.product_id}>
                                <div className="card-body">
                                    <div className="card mb-4 shadow-sm">
                                        <h5 className="card-title">{item.psong}</h5>
                                        <p className="card-text-descrip">Исполнитель {item.musician}</p>
                                        <p className='card-text-descrip'>Альбом {item.palbum}</p>
                                        <p className="card-text-age"><strong>Релиз: {item.pdd} {item.mm} {item.yy} года</strong></p>
                                    </div>
                                </div>
                                <button className='btn btn-primary' onClick={() => handleRemoveFromCart(item.pid)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Cart;
