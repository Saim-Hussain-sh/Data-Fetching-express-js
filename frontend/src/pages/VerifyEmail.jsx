import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES (only addition)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    const token = localStorage.getItem("tempToken");

    setError("");
    setSuccess("");

    if (!token) {
      setError("No token found. Please register again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://app.devmindsstudio.co/v1/api/auth/verify-email",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Email verified successfully");
        navigate("/set-password");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Email</h2>

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* ✅ ERROR DISPLAY */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {/* ✅ SUCCESS DISPLAY */}
        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
}