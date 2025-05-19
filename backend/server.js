// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Pool } = require('pg');
const { log, error } = require('console');
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'something',
password: '12345',
port: '5432'
});

const app = express();
const PORT = 5000;

app.use(express.json());

// Используем CORS
app.use(cors());

const family = [
{
id: 1,
song: 'Abracadabra',
album: 'MAYHEM',
dd: 3,
mm: 'марта',
yy: 2025,
musician: 'Lady Gaga'
},
{
id: 2,
song: 'life force',
album: 'freedom from self',
dd: 16,
mm: 'сентября',
yy: 2024,
musician: 'ptasinski, RJ Pasin'
},
{
id: 3,
song: 'Chest Pain (I Love)',
album: 'Chest Pain (I Love)',
dd: 4,
mm: 'декабря',
yy: 2024,
musician: 'Malcolm Todd'
},
{
id: 4,
song: 'First Song',
album: 'First Song',
dd: 20,
mm: 'марта',
yy: 2025,
musician: 'Roga.'
},
{
id: 5,
song: 'Where Are You',
album: 'Complex Happenings Reduced To A Simple Design',
dd: 20,
mm: 'августа',
yy: 2021,
musician: 'Leoniden'
},
{
id: 6,
song: 'Авантюрист',
album: 'Авантюрист',
dd: 8,
mm: 'марта',
yy: 2016,
musician: 'Виталий Чирва'
}
];
const count_of_family = 6;
// Эндпоинт для получения списка продуктов
app.get('/api/family', (req, res) => {
res.json(family);
});
app.get('/api/item/:id', (req, res) => {
const { id } = req.params;
const item = family.find(item => item.id === parseInt(id));

if (item) {
    res.status(200).json(item);
} else {
    res.status(404).json({ error: 'Song not found' });
}
});

// Эндпоинт для добавления нового продукта
app.post('/api/add', (req, res) => {
const { song, album, dd, mm, yy, musician } = req.body;

const newItem = {
    id: count_of_family+1,
    song,
    album,
    dd,
    mm,
    yy,
    musician
};

family.push(newItem);
res.status(201).json(newItem);
});

// Эндпоинт для удаления продукта по ID
app.delete('/api/del/', (req, res) => {
const { id } = req.body;
const index = family.findIndex(item => item.id === parseInt(id));

if (index !== -1) {
    const deletedItem = family.splice(index, 1);
    res.status(200).json(deletedItem[0]);
} else {
    res.status(404).json({ error: 'Song not found' });
}
});

// Эндпоинт для редактирования продукта по ID
app.put('/api/edit/', (req, res) => {
const { id, song, album, dd, mm, yy, musician } = req.body;
const index = family.findIndex(item => item.id === parseInt(id));

if (index !== -1) {
    const updatedItem = {
        id: parseInt(id),
        song: song || family[index].song,
        album: album || family[index].album,
        dd: dd || family[index].dd,
        mm: mm || family[index].mm,
        yy: yy || family[index].yy,
        musician: musician || family[index].musician,
    };

    family[index] = updatedItem;
    res.status(200).json(updatedItem);
} else {
    res.status(404).json({ error: 'Song not found' });
}
});

app.post('/register', async (req, res) => {
const { username, email, password } = req.body;

try {
    // Проверяем, существует ли пользователь с таким email
    const existingUser  = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
    if (existingUser .rows.length > 0) {
        return res.status(400).json({ error: 'User  already exists' });
    }

    // Хэшируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Вставляем нового пользователя
    const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES (\$1, \$2, \$3) RETURNING *',
        [username, email, passwordHash]
    );
    res.status(201).json(result.rows[0]);
} catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});

app.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);

    if (user.rows.length === 0) {
        return res.status(401).json({ error: 'User  not found' });
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (isValid) {
        const token = jwt.sign({ id: user.rows[0].id }, 'your_jwt_secret');
        const id = user.rows[0].id;
        const email = user.rows[0].email;
        const username = user.rows[0].username;
        return res.json({ token, id, email, username});
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
} catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
}
});

// Эндпоинт для добавления песни в плейлист
app.post('/api/cart/add', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const existingItem = await pool.query('SELECT * FROM cart WHERE user_id = \$1 AND product_id = \$2', [userId, productId]);
        if (existingItem.rowCount == 0)
        {
            // Если товара нет в плейлисте, добавляем его
            await pool.query('INSERT INTO cart (user_id, product_id) VALUES (\$1, \$2)', [userId, productId]);
            res.status(201).json({ message: 'Песня добавлена в плейлист' });
        }
        else
        {
            res.status(201).json({ message: 'Песня уже есть в плейлисте' });
        }
        
    } catch (error) {
        console.error('Ошибка при добавлении песни в плейлист:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Эндпоинт для получения плейлиста пользователя
app.get('/api/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = \$1', [userId]);
        
        // Сопоставление песен из плейлиста с данными из массива family
        const enrichedCartItems = cartItems.rows.map(cartItem => {
            const product = family.find(item => item.id === cartItem.product_id);
            return {
                pid: cartItem.product_id,
                psong: product ? product.song : 'У песни нет названия',
                palbum: product ? product.album : 'У песни нет альбома',
                pdd: product ? product.dd: 'XX',
                mm: product ? product.mm: "месяца",
                yy: product ? product.yy: 'XXXX',
                musician: product ? product.musician: "У песни нет исполнителя",
            };
        });

        res.json(enrichedCartItems);
    } catch (error) {
        console.error('Ошибка при получении плейлиста:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Эндпоинт для удаления песни из плейлиста
app.delete('/api/cart/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE user_id = \$1 AND product_id = \$2',
            [userId, productId]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Песня успешно удалена из плейлиста' });
        } else {
            res.status(404).json({ message: 'Песня не найдена в плейлисте' });
        }
    } catch (error) {
        console.error('Ошибка при удалении песни из плейлиста:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Запуск сервера
app.listen(PORT, () => {console.log("Сервер запущен на http://localhost:"+ PORT);});