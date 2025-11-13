// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_BACKEND_URL
  const login = async (email, password) => {
    try {
        setLoading(true);
        
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Usar el mensaje específico del backend
            const errorMessage = data.error || data.message || 'Error al iniciar sesión';
            throw new Error(errorMessage);
        }

        const userData = {
            id: data.user.id,
            token: data.access_token,
            email: data.user.email,
        };

        setUser(userData);

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('email', data.user.email);
           

        }

        return { success: true };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    } finally {
        setLoading(false);
    }
};

const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please add all information')
      return
    }

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        navigate('/protected')
      } else {
        
        if (result.error) {
          setError(result.error)
        } else {
          setError(result.error || 'Invalid credentials')
        }
      }
    } catch (error) {
      setError('Connection error: ' + error.message)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }



  return (
    <div className="loginContainer m-4 p-5">
      <div className="m-3 p-4 ">
        <form className="p-1" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" 
            className="form-control" 
            id="exampleInputEmail1" 
            aria-describedby="emailHelp"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" 
            className="form-control" 
            id="exampleInputPassword1"  
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required />
          </div>
          <button type="submit" className="btn btn-primary my-2">Submit</button>
        </form>
        <span>Don't have a user?</span><Link to="/register">Register</Link>
      </div>
      <br />

      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
