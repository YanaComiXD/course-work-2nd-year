import React, { useState, useEffect } from 'react';
import './card_design.css';

const userId = localStorage.getItem('userID');

const ProductCard = ({ family, cartItems, setCartItems, calculateTotalPrice }) => {
    const [isInCart, setIsInCart] = useState(false); // Состояние для отслеживания, добавлен ли товар в корзину

    // Функция для проверки, находится ли товар в корзине
    const checkIfInCart = async () => {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (response.ok) {
            const itemsInCart = await response.json();
            const itemInCart = itemsInCart.some(item => item.product_id === family.id);
            setIsInCart(itemInCart); // Устанавливаем состояние на основе данных из корзины
        } else {
            console.error('Ошибка при получении корзины');
        }
    };

    // Проверяем корзину при монтировании компонента
    useEffect(() => {
        if (userId) {
            checkIfInCart();
        }
    }, [userId]);

    const handleAddToCart = async () => {
        const response = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId: family.id }),
        });

        if (response.ok) {
            setIsInCart(true); // Устанавливаем состояние, что товар добавлен в корзину
            alert('Товар добавлен в корзину!');
        } else {
            alert('Ошибка при добавлении товара в корзину.');
        }
    };

    const handleRemoveFromCart = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${userId}/${family.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Проверяем, что cartItems определен перед фильтрацией
                if (cartItems) {
                    const updatedCartItems = cartItems.filter(item => item.product_id !== family.id);
                    setCartItems(updatedCartItems);
                    calculateTotalPrice(updatedCartItems);
                }
                setIsInCart(false); // Обновляем состояние
                alert('Песня удалена из плейлиста'); // Уведомление о успешном удалении
            } else {
                // Обработка ошибок, если товар не найден
                if (response.status === 404) {
                    alert('Песня не найдена в плейлисте.');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Ошибка при удалении песни');
                }
            }
        } catch (error) {
            console.error('Ошибка при удалении песни:', error);
            alert('Ошибка при удалении песни');
        }
    };

    return (
        <div className="col-md-4">
            <div className="card-body">
                <div className="card mb-4 shadow-sm">
                    <h5 className="card-title">{family.song}, ID: {family.id}</h5>
                    <p className="card-text-descrip">Исполнитель {family.musician}</p>
                    <p className='card-text-descrip'>Альбом {family.album}</p>
                    <p className="card-text-age"><strong>Релиз: {family.dd} {family.mm} {family.yy} года</strong></p>
                    {!isInCart ? (
                        <button onClick={handleAddToCart} className="btn btn-primary">
                            Добавить в плейлист
                        </button>
                    ) : (
                        <button onClick={handleRemoveFromCart} className="btn btn-primary">Удалить из плейлиста</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
