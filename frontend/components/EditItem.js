import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditItem = () => {
    const { id } = useParams();
    const [item, setItem] = useState({ id: '', song: '', album: '', dd: "XX", mm: '', yy: "XX", musician: ''});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/item/${id}`);
                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchItem();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/edit/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item), // Передаем весь объект item, включая ID
            });

            const data = await response.json();
            console.log('Отредактированный элемент:', data);
            // Можно добавить редирект или уведомление об успешном редактировании
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Редактировать элемент</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={item.id} onChange={(e) => setItem({ ...item, id: e.target.value })} placeholder="ID" />
                <input type="text" value={item.song} onChange={(e) => setItem({ ...item, song: e.target.value })} placeholder="Новое название" required />
                <input type="text" value={item.musician} onChange={(e) => setItem({ ...item, musician: e.target.value })} placeholder="Новый исполнитель" required />
                <input type="text" value={item.album} onChange={(e) => setItem({ ...item, album: e.target.value })} placeholder="Новое название альбома" required />

                <input type="number" value={item.dd} onChange={(e) => setItem({ ...item, dd: e.target.value })} placeholder="Новый день релиза" required />
                <input type="text" value={item.mm} onChange={(e) => setItem({ ...item, mm: e.target.value })} placeholder="Новый месяц релиза" required />
                <input type="number" value={item.yy} onChange={(e) => setItem({ ...item, yy: e.target.value })} placeholder="Новый год релиза" required />

                <button type="submit">Сохранить изменения</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default EditItem;
