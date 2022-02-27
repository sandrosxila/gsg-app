import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FETCH_USER } from '../../actions/userTypes';
import { RootState } from '../../reducers';
import Header from './Header';

type Product = {
    _id: string;
    name: string;
    price: number;
    weight: number;
    createdAt: string;
    createdBy: {
        username: string;
        fullName: string;
        _id: string;
    }
}

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const { user: { username } } = useSelector((state: RootState) => state.auth);
    const { id } = useSelector((state: RootState) => state.user);

    const [products, setProducts] = useState<Product[]>([]);

    const [editId, setEditId] = useState('');

    const [editingProduct, setEditingProduct] = useState({
        name: '',
        price: '',
        weight: ''
    });

    const [creatingProduct, setCreatingProduct] = useState({
        name: '',
        price: '',
        weight: ''
    });

    const onEditButtonClick = (product: Product) => () => {
        setEditId(product._id);
        setEditingProduct({
            name: product.name,
            price: product.price.toString(),
            weight: product.weight.toString()
        });
    };

    const onDeleteButtonClick = (id: string) => () => {
        axios.delete(`/products/${id}`)
            .then(() => {
                const newProducts = products.filter(product => product._id !== id);
                setProducts(newProducts);
            });
    };

    useEffect(() => {
        if (username) {
            dispatch({ type: FETCH_USER, payload: username });
        }
    }, [dispatch, username]);

    const fetchProducts = () => {
        axios.get('/products').then(res => {
            setProducts(res.data.products.map((product: Product) => ({
                _id: product._id,
                name: product.name,
                price: product.price,
                weight: product.weight,
                createdAt: product.createdAt,
                createdBy: {
                    _id: product.createdBy._id,
                    username: product.createdBy.username,
                    fullName: product.createdBy.fullName
                }
            })));
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const onSubmitEdit = () => {
        const { name, price, weight } = editingProduct;

        if (editId) {
            axios.put(`/products/${editId}`, { name, price, weight })
                .then(() => {
                    const newProducts = products.map(product => {
                        if (product._id === editId) {
                            return {
                                ...product,
                                name,
                                price: Number(price),
                                weight: Number(weight)
                            };
                        }

                        return product;
                    });

                    setProducts(newProducts);
                    setEditId('');
                });
        }
    };

    const onSubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('/products', { 
            username,
            name: creatingProduct.name,
            price: Number(creatingProduct.price || '0'),
            weight: Number(creatingProduct.weight || '0')
        }).then(() => {
            fetchProducts();
            setCreatingProduct({
                name: '',
                price: '',
                weight: ''
            });
        });
    };

    return (
        <>
            <Header />
            <CreateProduct onSubmit={ onSubmitCreate }>
                <div>
                    <label htmlFor='name-input'>Name:</label>
                    <input id="name-input" type="text" value={ creatingProduct.name } onChange = {
                        (e) => {
                            setCreatingProduct(prevState => ({
                                ...prevState,
                                name: e.target.value
                            }));
                        }
                    }
                    />
                </div>
                <div>
                    <label htmlFor='price-input'>Price:</label>
                    <input id="price-input" type="text" value={ creatingProduct.price } onChange={
                        (e) => {
                            if(!isNaN(Number(e.target.value))) {
                                setCreatingProduct(prevState => ({
                                    ...prevState,
                                    price: e.target.value
                                }));
                            }
                        }
                    }
                    />
                </div>
                <div>
                    <label htmlFor='weight-input'>Weight:</label>
                    <input id="weight-input" type="text" value={ creatingProduct.weight } onChange={
                        (e) => {
                            if(!isNaN(Number(e.target.value))) {
                                setCreatingProduct(prevState => ({
                                    ...prevState,
                                    weight: e.target.value
                                }));
                            }
                        }
                    }
                    />
                </div>
                <button type="submit">
                    Create
                </button>
            </CreateProduct>
            <ProductsTable>
                <ProductsTableHeader>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Weight</th>
                        <th>Created At</th>
                        <th>Created By</th>
                        <th>actions</th>
                    </tr>
                </ProductsTableHeader>
                <tbody>
                    {
                        products.map(product => (
                            <tr key={ product._id }>
                                <ProductsTableData>
                                    {
                                        editId === product._id ? (
                                            <input type="text" value={ editingProduct.name } onChange={
                                                (e) => {
                                                    setEditingProduct(prevState => ({
                                                        ...prevState,
                                                        name: e.target.value
                                                    }));
                                                }
                                            }
                                            />
                                        ) : (
                                            <>
                                                { product.name }
                                            </>
                                        )
                                    }
                                                
                                </ProductsTableData>
                                <ProductsTableData>
                                    {
                                        editId === product._id ? 
                                            (
                                                <input type="text" value={ editingProduct.price } onChange={
                                                    (e) => {
                                                        if(!isNaN(Number(e.target.value))) {
                                                            setEditingProduct(prevState => ({
                                                                ...prevState,
                                                                price: e.target.value
                                                            }));
                                                        }
                                                    }
                                                }
                                                />
                                            ) : (
                                                <>
                                                    { product.price }
                                                </>
                                            )
                                    }
                                </ProductsTableData>
                                <ProductsTableData>
                                    {
                                        editId === product._id ? 
                                            (
                                                <input type="text" value={ editingProduct.weight } onChange={
                                                    (e) => {
                                                        if(!isNaN(Number(e.target.value))) {
                                                            setEditingProduct(prevState => ({
                                                                ...prevState,
                                                                weight: e.target.value
                                                            }));
                                                        }
                                                        
                                                    }
                                                }
                                                />
                                            ) : (
                                                <>
                                                    { product.weight }
                                                </>
                                            )
                                    }
                                </ProductsTableData>
                                <ProductsTableData>
                                    { new Date(product.createdAt).toLocaleString() }
                                </ProductsTableData>
                                <ProductsTableData>
                                    { product.createdBy.username }
                                </ProductsTableData>
                                <ProductsTableData>
                                    {
                                        id === product.createdBy._id && (
                                            editId === product._id ? (
                                                <>
                                                    <button onClick={ onSubmitEdit }>Submit Edit</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={ onEditButtonClick(product) }>Edit</button>
                                                    <button onClick={ onDeleteButtonClick(product._id) }>Delete</button>
                                                </>
                                            )
                                        )
                                    }
                                </ProductsTableData>
                                
                            </tr>
                        ))
                    }
                </tbody>
            </ProductsTable>
        </>
    );
};


const CreateProduct = styled.form`
    all: unset;
    padding: 0.5rem 10rem;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
`;

const ProductsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const ProductsTableHeader = styled.thead`
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
`;

const ProductsTableData = styled.td`
    text-align: center;
`;

export default Dashboard;