import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Navbar = () => {

    const [open, setOpen] = useState(false);
    const user = useSelector((store) => store.user.user);
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const nevigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            const res = await axios.post("http://localhost:7777/user/logout", {}, { withCredentials: true });
            if (res?.data?.success) {
                dispatch(removeUser());
                nevigate("/login")
            }
        } catch (err) {
            setLoader(false);
            console.log(err);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
            {/* Left side */}
            <div className="flex items-center gap-5">
                <span className="text-xl font-bold text-indigo-600">Estetica</span>
                <span className="text-gray-600 text-sm">
                    Welcome Back, {user?.name}
                </span>
            </div>

            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <input
                    type="text"
                    placeholder="Search…"
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <span
                    onClick={() => setOpen((prev) => !prev)}
                    className="cursor-pointer font-medium text-gray-700 select-none"
                >
                    Profile
                </span>

                {open && (
                    <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-default">
                            {user?.name}
                        </div>
                        <button
                            onClick={() => handleLogout()}
                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;