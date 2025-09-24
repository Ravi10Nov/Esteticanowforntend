import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {  addItemServer, selectCartItems, fetchCart,  decreaseItemServer, removeItemServer } from "../store/cartSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";



const Product = () => {

    const [categorie, setCategorie] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(false);


    const [cart, setCart] = useState([]);
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const isAuth = useSelector((store) => !!store.user?.user);
    const nevigate = useNavigate();

    // useEffect(() => {
    //     setCart(cartItems);
    // }, [cartItems]);

    useEffect(() => {
        const formatted = cartItems.map((item) => ({
            ...item.product,
            qty: item.quantity,
        }));
        setCart(formatted);
    }, [cartItems]);



    const addToCart = (p) => {
        dispatch(addItemServer({ productId: p._id, quantity: 1, setLoader }))
    };

    const updateQty = (_id, delta) => {
        setCart((prev) =>
            prev
                .map((c) =>
                    c._id === _id ? { ...c, qty: c.qty + delta } : c
                )
                .filter((c) => c.qty > 0)
        );
    };

    const fetchData = async () => {
        try {
            setLoader(true);
            const [categoryRes, productRes] = await Promise.all([
                axios.get("http://localhost:7777/category/getCategory"),
                axios.get("http://localhost:7777/product/getProducts")
            ]);

            if (categoryRes.data.success) {
                setCategorie(categoryRes.data.categories);
                if (categoryRes.data.categories.length > 0) {
                    setSelectedCategory(categoryRes.data.categories[0]);
                }
            }


            if (productRes.data.success) {
                setProducts(productRes.data.products);
            }
            setLoader(false);

        } catch (err) {
            console.error("Failed to fetch categories or products:", err);
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (isAuth) {
            dispatch(fetchCart({ setLoader }));
        }
    }, [isAuth, dispatch]);


    console.log("cartItems: ", cartItems);
    console.log("cart: ", cart);

    if (loader) return <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#10b981" size={80} />
    </div>


    return (

        <div className="flex min-h-screen bg-blue-50">
            <div
                className={`p-6 transition-all duration-300
          ${cart.length ? "w-full md:w-3/4" : "w-full"}`}
            >
                <h2 className="text-2xl font-semibold mb-4">Products</h2>

                <input
                    type="text"
                    placeholder="Search for Product!"
                    className="w-64 mb-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                {/* Categories */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {categorie?.map((c) => (
                        <button
                            key={c._id}
                            onClick={() => setSelectedCategory(c)}
                            className={`px-4 py-1 rounded-full text-sm transition border 
                ${selectedCategory === c
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="grid gap-4 grid-cols-2 sm:grid-cols-6 lg:grid-cols-6">

                    {products
                        .filter(p => selectedCategory ? p.category._id === selectedCategory._id : true)
                        .map((p) => (
                            <div
                                key={p._id}
                                className="bg-white p-2 rounded-xl shadow hover:shadow-md transition text-center cursor-pointer"
                            >
                                <div className="w-full h-24 flex items-center justify-center mb-3">
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="h-full object-contain rounded-lg"
                                    />
                                </div>

                                <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                                <p className="text-gray-500 text-sm mt-1">₹{p.price}</p>

                                <button
                                    onClick={() => addToCart(p)}
                                    className="mt-3 bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-600"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                </div>

            </div>

            {cart.length > 0 && (
                <div className="hidden md:block w-full md:w-1/4 bg-white border-l border-gray-200 p-6">
                    <div className="flex justify-between item-center">
                        <h3 className="text-lg font-semibold mb-4">Product Cart</h3>
                        <button
                            onClick={() => dispatch(removeItemServer({ setLoader }))}
                            className="p-1 hover:bg-gray-100 rounded-full"
                            title="Remove all items"
                        >
                            <img
                                src="/trash.png"
                                alt="Delete All"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                    {cart.map((item, index) => (
                        <div key={index} className="mb-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-lg object-contain border"
                                />
                                <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-sm text-indigo-500 font-semibold">₹{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        // updateQty(item._id, -1)
                                        dispatch(decreaseItemServer({ productId: item._id, setLoader }))
                                    }}
                                    className="px-2 py-1 border rounded"
                                >
                                    -
                                </button>
                                <span>{item.qty}</span>
                                <button
                                    onClick={() => {
                                        // updateQty(item._id, 1)
                                        dispatch(addItemServer({ productId: item._id, quantity: 1, setLoader }))
                                    }}
                                    className="px-2 py-1 border rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                    <Link to="/orderComplete" >
                        <button className="w-full mt-4 bg-indigo-500 text-white py-2 rounded-md">
                            Checkout
                        </button>
                    </Link>
                </div>
            )}

        </div>
    )
}

export default Product;