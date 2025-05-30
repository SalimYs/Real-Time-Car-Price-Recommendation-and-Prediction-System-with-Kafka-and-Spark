import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaCar, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    location: '',
    preferredBrands: [],
    preferredFuelTypes: [],
    preferredTransmissions: [],
    budgetMin: '',
    budgetMax: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const brands = [
    'Audi', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Honda', 'Hyundai', 
    'Kia', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 
    'Renault', 'Seat', 'Skoda', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  const fuelTypes = ['Essence', 'Diesel', 'Hybrid', 'Electric', 'GPL'];
  const transmissions = ['Manuelle', 'Automatique', 'Semi-automatique'];
  const cities = [
    'Agadir', 'Casablanca', 'Fès', 'Marrakech', 'Meknès', 'Mohammedia', 
    'Oujda', 'Rabat', 'Salé', 'Tanger', 'Tétouan', 'Benguerir', 'El Jadida'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target;
      const arrayName = name.split('-')[0];
      const itemValue = name.split('-')[1];
      
      setFormData(prev => {
        if (checked) {
          return {
            ...prev,
            [arrayName]: [...prev[arrayName], itemValue]
          };
        } else {
          return {
            ...prev,
            [arrayName]: prev[arrayName].filter(item => item !== itemValue)
          };
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const nextStep = (e) => {
    e.preventDefault(); // Prevent form submission
    if (step === 1) {
      // Validate first step
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // Step 1: Register the user
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
      };
  
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', userData);
      const { user } = registerResponse.data;
  
      // Step 2: Store user preferences
      const preferencesData = {
        userId: user.id, // Send userId in the body
        budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : 0,
        budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : 0,
        mileage_min: 0, // Not collected in the form, set to 0
        mileage_max: 0, // Not collected in the form, set to 0
        preferred_brands: formData.preferredBrands,
        preferred_fuel_types: formData.preferredFuelTypes,
        preferred_transmissions: formData.preferredTransmissions,
        preferred_years: [], // Not collected in the form
        preferred_door_count: [], // Not collected in the form
      };
  
      await axios.put('http://localhost:5000/api/users/preferences', preferencesData);
  
      // Step 3: Store user and preferences in localStorage for session management
      localStorage.setItem('carUser', JSON.stringify(user));
      localStorage.setItem('carUserPreferences', JSON.stringify(preferencesData));
  
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
      setLoading(false);
    }
  };




  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="bg-warning p-3 rounded-circle d-inline-flex mb-3">
                  <FaCar className="text-white" size={30} />
                </div>
                <h2 className="fw-bold">Create Your Account</h2>
                <p className="text-muted">Join us to personalize your car shopping experience</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="progress mb-4 rounded-pill" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-warning" 
                  role="progressbar" 
                  style={{ width: `${step * 50}%` }} 
                  aria-valuenow={step * 33} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                />
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <h5 className="mb-3 fw-bold">Account Information</h5>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username*</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaUser className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email*</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password*</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-text">Password must be at least 8 characters</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="age" className="form-label">Age</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaBirthdayCake className="text-muted" />
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          id="age"
                          name="age"
                          placeholder="Enter your age"
                          value={formData.age}
                          onChange={handleChange}
                          min="18"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="location" className="form-label">Location</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaMapMarkerAlt className="text-muted" />
                        </span>
                        <select
                          className="form-select"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                        >
                          <option value="">Select your city</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h5 className="mb-3 fw-bold">Car Preferences</h5>
                    <p className="text-muted mb-4">Tell us what you're looking for to get personalized recommendations</p>
                    
                    <div className="mb-4">
                      <label className="form-label">Preferred Brands</label>
                      <div className="row row-cols-2 g-2">
                        {brands.map(brand => (
                          <div key={brand} className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`brand-${brand}`}
                                name={`preferredBrands-${brand}`}
                                checked={formData.preferredBrands.includes(brand)}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor={`brand-${brand}`}>
                                {brand}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Fuel Type</label>
                      <div className="row row-cols-2 g-2">
                        {fuelTypes.map(fuel => (
                          <div key={fuel} className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`fuel-${fuel}`}
                                name={`preferredFuelTypes-${fuel}`}
                                checked={formData.preferredFuelTypes.includes(fuel)}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor={`fuel-${fuel}`}>
                                {fuel}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Transmission</label>
                      <div className="row row-cols-2 g-2">
                        {transmissions.map(transmission => (
                          <div key={transmission} className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`transmission-${transmission}`}
                                name={`preferredTransmissions-${transmission}`}
                                checked={formData.preferredTransmissions.includes(transmission)}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor={`transmission-${transmission}`}>
                                {transmission}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label htmlFor="budgetMin" className="form-label">Budget Min (MAD)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="budgetMin"
                          name="budgetMin"
                          placeholder="Minimum"
                          value={formData.budgetMin}
                          onChange={handleChange}
                          min="0"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="budgetMax" className="form-label">Budget Max (MAD)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="budgetMax"
                          name="budgetMax"
                          placeholder="Maximum"
                          value={formData.budgetMax}
                          onChange={handleChange}
                          min="0"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-between mt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 rounded-pill"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                  )}
                  
                  {step < 2 ? (
                    <button
  type="button"
  className="btn btn-warning px-4 rounded-pill ms-auto"
  onClick={nextStep} // This already passes the event
>
  Next
</button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-warning px-4 rounded-pill ms-auto"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  )}
                </div>

                {step === 1 && (
                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Already have an account? <Link to="/login" className="text-decoration-none" style={{ color: "#BC7328" }}><strong>Sign In</strong></Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;