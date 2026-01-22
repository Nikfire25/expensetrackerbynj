import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatch the thunk
      const resultAction = await dispatch(registerUser({ email, password }));

      // Check if the registration was successful
      if (registerUser.fulfilled.match(resultAction)) {
        setRegistrationSuccess(true);
        toast.success("User registered successfully! 🎉");
      } else if (registerUser.rejected.match(resultAction)) {
        // Handle failure case
        toast.error("Registration failed ❌");
      }
    } catch (error) {
      // Optional catch for unexpected errors
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ✅ Redirect after successful registration
  useEffect(() => {
    if (registrationSuccess || isAuthenticated) {
      navigate("/transactions");
    }
  }, [registrationSuccess, isAuthenticated, navigate]);

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-danger">{error}</p>}
        <button
          className="btn btn-primary w-100 mb-3"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
