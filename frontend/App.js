import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditItem from './components/EditItem';
import DeleteItem from './components/DeleteItem';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [selectedOption, setSelectedOption] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('userID');
        setIsAuthenticated(false);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'add':
                return <AddProduct />;
            case 'edit':
                return <EditItem />;
            case 'delete':
                return <DeleteItem />;
            default:
                return null;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <div className="container">
                            <Header onLogout={handleLogout} />
                            <ProductList />
                            <div className="mb-3">
                                <label htmlFor="actionSelect" className="form-label">Выберите действие</label>
                                <select id="actionSelect" className="form-select" onChange={handleSelectChange} value={selectedOption}>
                                    <option value="">-- Выберите --</option>
                                    <option value="add">Добавить песню</option>
                                    <option value="edit">Редактировать информацию о песне</option>
                                    <option value="delete">Удалить песню</option>
                                </select>
                            </div>
                            <div>
                                {renderSelectedComponent()}
                            </div>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;
