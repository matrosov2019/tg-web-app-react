import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Джинсы Levis', price: 3000, description: 'Синего цвета, прямые'},
    {id: '2', title: 'Кроссовки Nike', price: 3000, description: 'Синего цвета, прямые'},
    {id: '3', title: 'Пальто H&M', price: 3000, description: 'Синего цвета, прямые'},
    {id: '4', title: 'Ботинки', price: 3000, description: 'Синего цвета, прямые'},
    {id: '5', title: 'Сандали', price: 3000, description: 'Синего цвета, прямые'},
    {id: '6', title: 'Легинсы', price: 3000, description: 'Синего цвета, прямые'},
    {id: '7', title: 'Лосины', price: 3000, description: 'Синего цвета, прямые'},
    {id: '8', title: 'Лонгслив', price: 3000, description: 'Синего цвета, прямые'},
    {id: '9', title: 'Рубашка', price: 3000, description: 'Синего цвета, прямые'},
    {id: '10', title: 'Джемпер', price: 3000, description: 'Синего цвета, прямые'},
    {id: '11', title: 'Кофта', price: 3000, description: 'Синего цвета, прямые'},
    {id: '12', title: 'Кардиган', price: 3000, description: 'Синего цвета, прямые'},
    {id: '13', title: 'Свитер', price: 3000, description: 'Синего цвета, прямые'},
    {id: '14', title: 'Свитшот', price: 3000, description: 'Синего цвета, прямые'}
];

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            queryId: queryId,
            products: addedItems,
            totalPrice: getTotalPrice(addedItems)
        };
        fetch("https://localhost:8000", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        //tg.sendData(JSON.stringify(data));
    }, [addedItems]);

    useEffect(() => {
        tg.MainButton.onClick(onSendData);
        return () => {
            tg.MainButton.offClick(onSendData);
        }
    }, [tg, onSendData]);

    const getTotalPrice = (items) => {
        return items.reduce((prev, item) => prev + item.price, 0);
    };
    //Добавление в корзину
    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];
        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }
        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)} р`
            });
        }
    };

    return (
        <div className={'list'}>
            {products.map(item => {
                return <ProductItem product={item} onAdd={onAdd} className={'item'}/>
            })}
        </div>
    );
};

export default ProductList;
