// src/components/ProductCard.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [family, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/api/family');
            const data = await response.json();
            setProducts(data);
        };
        fetchData();
    }, []);

    return (
        <div className="row">
            {family.map(family => (
                <ProductCard key={family.id} family={family} />
            ))}
        </div>
    );
};

export default ProductList;

