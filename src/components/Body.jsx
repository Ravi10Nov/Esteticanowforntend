import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/userSlice";

const Body = () => {

    const dispatch = useDispatch();
    const nevigate = useNavigate();
    const user = useSelector((store) => store.user.user);

    const fetchUser = async () => {

        try {
            const res = await axios.get("http://localhost:7777/user/getProfile", { withCredentials: true });
            if (res?.data?.success) {
                dispatch(addUser(res?.data?.user));
            } else {
                nevigate("/login")
            }
        } catch (err) {
            console.log(err)
        }
    };

    // useEffect(() => {
    //     fetchUser()
    // }, [])

    useEffect(() => {
        const hasToken = document.cookie
            .split("; ")
            .some((c) => c.startsWith("token="));

        if (!hasToken) {
            nevigate("/login");
            return;
        }
        fetchUser();
    }, [nevigate]);

    console.log("user: ", user)


    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default Body;