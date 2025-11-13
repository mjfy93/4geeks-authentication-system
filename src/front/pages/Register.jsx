// Import necessary hooks and components from react-router-dom and other libraries.
import { useState } from 'react'
import { useNavigate } from 'react-router'



// Define and export the Single component which displays individual item details.
export const Register = () => {
  // Access the global state using the custom hook.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_BACKEND_URL

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formData.email || !formData.password) {
      setError('lease all of the information')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Passwords must be at least 8 characters long')
      setLoading(false)
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please add a valid email')
      setLoading(false)
      return
    }

    try {
      console.log(' User registration', {
        email: formData.email,
        password: formData.password
      })

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password

        }),
      })

      const data = await response.json()


      if (response.ok) {
        navigate('/protected')



      } else {
        setError(data.error || data.message || 'Registration error')
      }
    } catch (err) {
      console.error('💥 egistration erorr:', err)
      setError('Error de conexión con el servidorServer connection error')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className='registerContainer m-5 p-5'>
      <form onSubmit={handleSubmit}>


        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">Contraseña *</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder=""
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            placeholder=""
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Creando cuenta...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
};



