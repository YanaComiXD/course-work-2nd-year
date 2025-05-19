import React, { useState } from 'react';

const DeleteItem = () => {
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        try {
            const response = await fetch('http://localhost:5000/api/del/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }), // Отправляем только ID
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при удалении элемента');
            }

            const data = await response.json();
            console.log('Удалённый элемент:', data);
            setSuccess(true); // Успешное удаление
            setError(''); // Сброс ошибки
            setId(''); // Очистка поля ввода
        } catch (err) {
            setError(err.message);
            setSuccess(false); // Сброс успешного состояния
        }
    };

    return (
        <div>
            <h2>Удалить элемент</h2>
            <form onSubmit={handleDelete}>
                <input 
                    type="text" 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                    placeholder="ID" 
                />
                <button type="submit">Удалить!</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Элемент успешно удалён!</p>}
        </div>
    );
};

export default DeleteItem;
