import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            let response = await fetch('https://fakestoreapi.com/products');
            let json = await response.json();
            setProducts(json);
        };
        loadData();
    }, []);

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
    }, [addedItems, queryId]);

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
