import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
 
export default function Login(){
    const [formData,setFormData] = useState({
        email:"",
        password:""
    });

    const [errors,setErrors] = useState({});
    const [showPassword,setShowPassword] = useState(false);
 
    const navigate = useNavigate();

    //Validate
    const validate = ()=>{
        const newErrors={};

        const email = formData.email.trim();
        const password = formData.password.trim();

        // EMAIL VALIDATION (STRONGER)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!email){
            newErrors.email = "Email is required";
        } 
        else if(email.includes("..")){
            newErrors.email = "Email cannot contain consecutive dots";
        }
        else if(!emailRegex.test(email)){
            newErrors.email = "Enter a valid email";
        }

        // PASSWORD VALIDATION (STRONGER)
        if(!password){
            newErrors.password = "Password is required";
        }
        else if(password.length < 6){
            newErrors.password = "Password must be at least 6 characters";
        }
        else if(!/[A-Z]/.test(password)){
            newErrors.password = "Password must contain at least 1 uppercase letter";
        }
        else if(!/[0-9]/.test(password)){
            newErrors.password = "Password must contain at least 1 number";
        }
        else if(!/[!@#$%^&*]/.test(password)){
            newErrors.password = "Password must contain a special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    //Handle Change
    const handleChange = (e)=>{
        const {name , value} = e.target;

        setFormData({
            ...formData,
            [name]:value
        });

        //remove error while typing
        if(errors[name]){
            setErrors({
                ...errors,
                [name]:""            
            });
        }
    };

    const handleLogin = async() =>{
        if(!validate()) return;

        try{
            const res = await fetch(
                "https://app.devmindsstudio.co/v1/api/auth/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email: formData.email.trim(),
                        password: formData.password.trim()
                    })
                }
            );

            const data = await res.json();

            if(res.ok){
                localStorage.setItem("accessToken",data.data.accessToken);
                localStorage.setItem("refreshToken",data.data.refreshToken);

                navigate("/gender");
            }
            else{
                setErrors({api:data.message || "Login failed"});
            }

        } catch(error){
            setErrors({api: error.message})
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>

                <input 
                    name="email"
                    type= "email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}

                {/* PASSWORD */}
                <div style={{position:"relative"}}>
                    <input 
                        name="password"
                        type ={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        style = {{paddingRight:"40px"}}
                    />
                    <span 
                        onClick={()=> setShowPassword(!showPassword)}
                        style={{
                            position:"absolute",
                            right:"10px",
                            top:"50%",
                            transform:"translateY(-50%)",
                            cursor:"pointer"
                        }}
                    >
                        {showPassword ? (<EyeOff size={18}/> ):(<Eye size={18}/>)}
                    </span>
                </div>

                {/* FIXED BUG HERE */}
                {errors.password && (
                    <span className="error" style={{color:"red"}}>{errors.password}</span>
                )}

                {errors.api && (<span className="error" style={{color:"red"}}>{errors.api}</span>)}

                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}