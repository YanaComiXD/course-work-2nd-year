import React, { useState } from 'react';

const AddProduct = () => {
    const [song, setName] = useState('');
    const [musician, setMusician] = useState('');
    const [album, setAlbum] = useState('');
    const [dd, setDd] = useState('');
    const [mm, setMm] = useState('');
    const [yy, setYy] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ song, album, dd, mm, yy, musician }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении продукта');
            }

            const data = await response.json();
            console.log('Добавленный продукт:', data);
            setSuccessMessage('Продукт успешно добавлен!'); // Сообщение об успехе
            // Сброс формы после успешного добавления
            setName('');
            setMusician('');
            setAlbum('');
            setDd('');
            setMm('');
            setYy('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Добавить песню</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={song}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название"
                    required
                />
                <input
                    type="text"
                    value={musician}
                    onChange={(e) => setMusician(e.target.value)}
                    placeholder="Исполнитель"
                    required
                />
                <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="Название альбома"
                    required
                />
                <input
                    type="number"
                    value={dd}
                    onChange={(e) => setDd(e.target.value)}
                    placeholder="День релиза"
                    required
                />
                <input
                    type="text"
                    value={mm}
                    onChange={(e) => setMm(e.target.value)}
                    placeholder="Месяц релиза"
                    required
                />
                <input
                    type="number"
                    value={yy}
                    onChange={(e) => setYy(e.target.value)}
                    placeholder="Год релиза"
                    required
                />
                <button type="submit">Добавить</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default AddProduct;
