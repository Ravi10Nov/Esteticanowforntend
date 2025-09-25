import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../src/config";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ setLoader }, { rejectWithValue }) => {
    try {
        setLoader(true);
        const res = await axios.get("/cart/getCart", { withCredentials: true });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    } finally {
        setLoader(false);
    }
});

export const addItemServer = createAsyncThunk("cart/addItemServer", async ({ productId, quantity = 1, setLoader }, { rejectWithValue }) => {
    try {
        setLoader(true);
        const res = await axios.post("/cart/addItem", { productId, quantity }, { withCredentials: true });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    } finally {
        setLoader(false);
    }
});

export const decreaseItemServer = createAsyncThunk("cart/removeItemServer", async ({ productId, setLoader }, { rejectWithValue }) => {
    try {
        setLoader(true);
        const res = await axios.post("/cart/decreaseItem", { productId });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    } finally {
        setLoader(false);
    }
});

export const removeItemServer = createAsyncThunk("cart/removeItemServer", async ({ setLoader }, { rejectWithValue }) => {
    try {
        setLoader(true);
        const res = await axios.delete("/cart/removeItem", { withCredentials: true });
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    } finally {
        setLoader(false);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        status: "idle",
        error: null
    },
    reducers: {
        removeLocalItem(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(i => i.product._id !== productId);
        },
        setLocalCart(state, action) {
            state.items = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.status = "succeeded";
            })
            .addCase(fetchCart.pending, (state) => { state.status = "loading"; })
            .addCase(fetchCart.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
            .addCase(addItemServer.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.status = "succeeded";
            })
            .addCase(removeItemServer.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.status = "succeeded";
            })
            .addMatcher(
                action => action.type.endsWith("/pending"),
                state => { state.status = "loading"; }
            )
            .addMatcher(
                action => action.type.endsWith("/rejected"),
                (state, action) => { state.status = "failed"; state.error = action.payload || action.error; }
            );
    }
});

export const { removeLocalItem, setLocalCart } = cartSlice.actions;

export const selectCartItems = state => state.cart.items;
export const selectCartTotals = state => {
    const items = state.cart.items || [];
    const subtotal = items.reduce((acc, it) => acc + (it.product?.price || 0) * it.quantity, 0);
    return { subtotal, itemCount: items.reduce((s, i) => s + i.quantity, 0) };
};

export default cartSlice.reducer;

