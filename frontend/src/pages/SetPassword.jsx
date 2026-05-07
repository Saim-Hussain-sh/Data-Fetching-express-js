import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ErrorCollector from "../utils/append";

// ✅ UPDATED VALIDATION FUNCTION
export const validatePassword = (pass) => {
    const errors = new ErrorCollector();
    
    if (pass.includes(" ")) {
       errors.append("Password cannot contain spaces");
    }

    if (pass.length < 6) {
        errors.append("Password must be at least 6 characters long");
    }

    if (!/[A-Z]/.test(pass)) {
        errors.append("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(pass)) {
        errors.append("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
        errors.append("Password must contain at least one special character");
    }

    return errors.getAllErrors();
};

export default function SetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const token = localStorage.getItem("tempToken");

    const handleSubmit = async () => {
        setError("");

        // (optional reset — harmless, kept as you wrote)
        setErrors({
            password: "",
            confirmPassword: ""
        });

        const trimmedPassword = password.trim();
        const trimmedConfirm = confirmPassword.trim();

        const newErrors = {
            password: "",
            confirmPassword: ""
        };

        // ✅ Required checks
        if (!trimmedPassword) {
            newErrors.password = "Password is required";
        }

        if (!trimmedConfirm) {
            newErrors.confirmPassword = "Confirm password is required";
        }

        // ✅ Strong validation (only if password exists)
        if (trimmedPassword) {
            const passwordError = validatePassword(trimmedPassword);
            if (passwordError) {
                newErrors.password = passwordError;
            }
        }

        // ✅ Match check (only if both exist)
        if (trimmedPassword && trimmedConfirm && trimmedPassword !== trimmedConfirm) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        if (newErrors.password || newErrors.confirmPassword) return;

        try {
            console.log("Token:", token);
            const res = await fetch(
                "https://app.devmindsstudio.co/v1/api/auth/create-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    body: JSON.stringify({
                        password: trimmedPassword,
                        confirmPassword: trimmedConfirm
                    })
                }
            );
            
            const data = await res.json();

            if (res.ok) {
                setSuccess("Password created successfully");
                navigate("/login");
            } else {
                setError(data.message || "Failed to create password");
            }
        } catch (error) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Password</h2>

                {/* PASSWORD FIELD */}
                        
            <div style={{ marginBottom: "15px" }}>
                
                {/* Input + icon wrapper */}
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: "40px", width: "100%" }}
                    />
            
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer"
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>
                    
                {/* Error BELOW (separate) */}
                {errors.password && (
                    <span
                        style={{
                            color: "red",
                            display: "block",
                            marginTop: "5px",
                            whiteSpace: "pre-line"
                        }}
                    >
                        {errors.password}
                    </span>
                )}
            </div>
            
            
            {/* CONFIRM PASSWORD FIELD */}
            <div style={{ marginBottom: "15px" }}>
            
                {/* Input + icon wrapper */}
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ paddingRight: "40px", width: "100%" }}
                    />
            
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer"
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>
                    
                {/* Error BELOW (separate) */}
                {errors.confirmPassword && (
                    <span
                        style={{
                            color: "red",
                            display: "block",
                            marginTop: "5px"
                        }}
                    >
                        {errors.confirmPassword}
                    </span>
                )}
            </div>
            
                <button onClick={handleSubmit}>Submit</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
            </div>
        </div>
    );
}