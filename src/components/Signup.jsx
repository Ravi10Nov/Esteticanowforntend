import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { addUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [loader, setLoader] = useState(false);
    const nevigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData((pre) => ({
            ...pre,
            [name]: value
        }))
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formData.name === "" || formData.email === "" || formData.password === "") {
            alert("All fields required!!")
            return
        }
        const postData = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }
        try {
            setLoader(true)
            const res = await axios.post("http://localhost:7777/user/signup", postData, { withCredentials: true });
            if (res?.data?.success) {
                setLoader(false)
                nevigate("/");
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    if (loader) return <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#10b981" size={80} />
    </div>


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-md bg-white rounded-2xl p-8 shadow-md"
                aria-label="Create account form"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create account</h2>

                <label className="block mb-4">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="mt-2 block w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        autoComplete="name"
                        aria-required="true"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="mt-2 block w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        autoComplete="email"
                        aria-required="true"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-sm font-medium text-gray-700">Password</span>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Create a strong password"
                        className="mt-2 block w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        autoComplete="new-password"
                        aria-required="true"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>

                <button
                    type="submit"
                    className="w-full rounded-full py-3 font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm hover:opacity-95"
                >
                    Create account
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Signup;