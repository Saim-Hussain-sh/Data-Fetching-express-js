import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGender, submitName, getAllNames } from "../api";
import "../styles/GenderForm.css";
import "../styles/Auth.css";

function GenderForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    async function handleGetGender() {
        setError(null);
        const data = await getGender(name);
        if (data?.success) setResult(data);
        else setError(data?.error || "Something went wrong");
    }

    async function handleSubmit() {
        setError(null);
        const data = await submitName(name);
        if (data?.success) setResult(data);
        else setError(data?.error || "Something went wrong");
    }

    async function handleAll() {
        setError(null);
        const data = await getAllNames();
        if (data?.success) setResult(data);
        else setError(data?.error || "Something went wrong");
    }

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Gender Checker</h1>
                <button onClick={handleLogout} className="button" style={{ background: "#e74c3c" }}>
                    Logout
                </button>
            </div>

            <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
            />
            <br /><br />

            <button onClick={handleGetGender} className="button">Check Gender</button>
            <button onClick={handleSubmit} className="button">Submit Name</button>
            <button onClick={handleAll} className="button">View All Names</button>

            {error && (
                <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
            )}

            <div className="table-container">
                {result?.data && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Probability</th>
                                <th>Count</th>
                                <th>Deliverable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.data).map(([name, info], index) => (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{info.gender}</td>
                                    <td>{info.probability}</td>
                                    <td>{info.count}</td>
                                    <td>{info.deliverable ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default GenderForm;