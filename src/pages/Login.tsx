
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Eroare",
        description: "Introduceți utilizatorul și parola.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('authenticate_admin', {
        p_username: email,
        p_password: password
      });

      if (error) throw error;

      if (data) {
        // Salvează în localStorage că utilizatorul este autentificat
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', email);
        navigate("/dashboard");
      } else {
        toast({
          title: "Eroare de autentificare",
          description: "Utilizator sau parolă incorectă.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la autentificare.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              type="text"
              placeholder="Utilizator"
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
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            {isLoading ? "Se autentifică..." : "Autentificare"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
