import {BrowserRouter , Routes , Route} from "react-router-dom";
import GenderForm from "./pages/GenderForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/SetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import "./styles/GenderForm.css";
function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/set-password" element={<SetPassword />}/>
        <Route path="/gender" element={<GenderForm />}/>
        <Route path="/verify" element={<VerifyEmail />}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;