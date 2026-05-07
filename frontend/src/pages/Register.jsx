import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        companyName: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(""); 

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        // FULL NAME VALIDATION
        const name = formData.fullName.trim();

        if (!name) {
            newErrors.fullName = "Full name is required";
        } 
        else if (!/^[A-Za-z .]+$/.test(name)) {
            newErrors.fullName = "Only alphabets are allowed";
        } 
        else if ((name.match(/\./g) || []).length > 2) {
            newErrors.fullName = "Maximum 2 dots allowed in name";
        } 
        else {
            const lettersOnly = name.replace(/[ .]/g, "");
        
            if (lettersOnly.length < 3) {
                newErrors.fullName = "Name too short (at least 3 letters required)";
            } 
            else if (lettersOnly.length > 30) {
                newErrors.fullName = "Name too long (max 30 letters allowed)";
            }
        }

        const email = formData.email.trim();

        if (!email) {
            newErrors.email = "Email is required";
        } 
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            newErrors.email = "Enter a valid email format";
        } 
        else if (email.includes("..")) {
            newErrors.email = "Email cannot contain consecutive dots";
        } 
        else if (/^\./.test(email) || /\.$/.test(email)) {
            newErrors.email = "Email cannot start or end with a dot";
        }

        const company = formData.companyName.trim();

        if (!company) {
            newErrors.companyName = "Company name is required";
        } 
        else if (company.length < 3) {
            newErrors.companyName = "Company name must be at least 3 characters";
        } 
        else if (company.length > 50) {
            newErrors.companyName = "Company name cannot exceed 50 characters";
        } 
        else if (!/^[A-Za-z0-9&.,\- ]+$/.test(company)) {
            newErrors.companyName = "Invalid characters in company name";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ FIXED BLUR (field-based trimming)
    const handleBlur = (e) => {
        const { name, value } = e.target;

        const trimmedValue = value.trim();

        setFormData({
            ...formData,
            [name]: trimmedValue
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleRegister = async () => {
        setServerError(""); 

        if (!validate()) return;

        // ✅ CLEAN DATA BEFORE SENDING
        const cleanedData = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            companyName: formData.companyName.trim()
        };

        try {
            const res = await fetch(
                "https://app.devmindsstudio.co/v1/api/auth/register/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleanedData) // ✅ using cleaned data
                }
            );

            const data = await res.json();

            if (res.ok) {
                const token = data.data.tempToken;
                localStorage.setItem("tempToken", token);
                navigate("/verify");
            } else {
                setServerError(data.message || data.error || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Registration</h2>

                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.fullName && <span className="error" style={{color:"red"}}>{errors.fullName}</span>}

                <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.email && <span className="error" style={{color:"red"}}>{errors.email}</span>}

                <input
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.companyName && <span className="error" style={{color:"red"}}>{errors.companyName}</span>}

                <button onClick={handleRegister}>Submit</button>

                {serverError && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                        {serverError}
                    </p>
                )}
            </div>
        </div>
    );
}