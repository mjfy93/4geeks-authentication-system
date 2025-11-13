import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Protected = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAuth = async () => {
            const API_URL = import.meta.env.VITE_BACKEND_URL;
            try {
                const token = sessionStorage.getItem("token") || localStorage.getItem("token");

                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const response = await fetch(API_URL + "/api/protected", { // Fixed typo
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || data.error) {
                    setUser(null);
                } else {
                    setUser({
                        id: data.id,
                        email: data.email,
                    });
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div className="m-5 p-5">Loading...</div>;
    }

    return (
        <div className="privateContainer m-5 p-5">
            {user?.id ? (
                <div>
                    <h1>Private View</h1>
                    <h2>Thank you for registering and logging in.</h2>
                    <p>This is a private page, you were only able to access this page if you registered and logged in!</p>
                    <p>And since it's a private view, time to share something private: I am really happy I took this bootcamp, but, boy, am I glad it's over.</p>
                    <p>P.S.: Hola Sebastián :)</p>
                    <img src="https://static.wikia.nocookie.net/warner-bros-entertainment/images/9/9c/Thats-all-folks.jpg/revision/latest?cb=20170520050314" alt="" style={{ "width": "300px" }} />
                    <br />
                    <button type="button" className="btn btn-primary" onClick={logout}>Log out</button>
                </div>
            ) : (
                <div>
                    <h1>This page contains privilaged information.</h1>
                    <p>Please, log in to see this super secret, very important, highly sensitive information.</p>
                    <span><Link to="/login">Here.</Link> A super duper handy link to log in. Or, if you don't have an account, you can register <Link to="/register"> here.</Link> <br />It's super easy and you'll be able to see all of this page's secrets.</span>
                </div>
            )}
        </div>
    );
};