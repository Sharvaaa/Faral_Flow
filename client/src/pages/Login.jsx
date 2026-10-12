
import { useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaWarehouse,
  FaTags,
  FaChartLine,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

import { supabase } from "../services/supabase";

const features = [
  {
    icon: <FaClipboardList />,
    title: "Track Orders",
    description: "From packing to delivery",
  },
  {
    icon: <FaWarehouse />,
    title: "Manage Inventory",
    description: "Keep your stock in check",
  },
  {
    icon: <FaTags />,
    title: "Set Your Rates",
    description: "Manage product prices",
  },
  {
    icon: <FaChartLine />,
    title: "View Insights",
    description: "Understand your business",
  },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      // App.jsx observes the session and redirects to the dashboard.
    } catch (err) {
      setError(
        err.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-hero-content">
          <div className="login-brand">
            <span className="login-brand-icon">
              <FaBoxOpen />
            </span>

            <div>
              <div className="login-brand-name">
                Faral <span>Flow</span>
              </div>
              <p className="login-brand-caption">
                MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          <div className="login-intro">
            <p className="login-eyebrow">
              YOUR BUSINESS, SIMPLIFIED
            </p>

            <h1>
              Simplify operations.
              <span> Grow your business.</span>
            </h1>

            <p className="login-description">
              Manage your orders, inventory, rates and more —
              all in one place.
            </p>
          </div>

          <div className="login-features">
            {features.map((feature) => (
              <div className="login-feature" key={feature.title}>
                <div className="login-feature-icon">
                  {feature.icon}
                </div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="login-tagline">
            Fresh. Tasty. Together.
          </p>
        </div>

        <div className="login-decoration login-decoration-top" />
        <div className="login-decoration login-decoration-bottom" />
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-card-mark">
            <FaBoxOpen />
          </div>

          <h2>Welcome back!</h2>

          <p className="login-subtitle">
            Sign in to your Faral Flow account.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p role="alert" className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              <span>
                {loading ? "Signing you in..." : "Sign in"}
              </span>

              {!loading && <FaArrowRight />}
            </button>
          </form>

          <div className="login-security">
            <FaShieldAlt />

            <div>
              <h3>Secure access</h3>
              <p>Your account is protected by Supabase.</p>
            </div>
          </div>

          <p className="login-footer">
            Faral Flow · Business Management
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;