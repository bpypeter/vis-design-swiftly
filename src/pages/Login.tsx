
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple authentication logic - in real app would validate credentials
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <Car className="w-16 h-16 mx-auto mb-4 text-black" />
          <h1 className="text-3xl font-bold text-black mb-2">AUTONOM</h1>
          <p className="text-gray-600">Închirieri Auto</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email/Utilizator"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            Autentificare
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
