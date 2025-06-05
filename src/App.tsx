
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientNou from "./pages/ClientNou";
import RezervareVehicul from "./pages/RezervareVehicul";
import Documente from "./pages/Documente";
import ReturnareVehicul from "./pages/ReturnareVehicul";
import PlataFactura from "./pages/PlataFactura";
import Rapoarte from "./pages/Rapoarte";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <SidebarProvider>
                <Dashboard />
              </SidebarProvider>
            } />
            <Route path="/client-nou" element={
              <SidebarProvider>
                <ClientNou />
              </SidebarProvider>
            } />
            <Route path="/rezervare-vehicul" element={
              <SidebarProvider>
                <RezervareVehicul />
              </SidebarProvider>
            } />
            <Route path="/documente" element={
              <SidebarProvider>
                <Documente />
              </SidebarProvider>
            } />
            <Route path="/returnare-vehicul" element={
              <SidebarProvider>
                <ReturnareVehicul />
              </SidebarProvider>
            } />
            <Route path="/plata-factura" element={
              <SidebarProvider>
                <PlataFactura />
              </SidebarProvider>
            } />
            <Route path="/rapoarte" element={
              <SidebarProvider>
                <Rapoarte />
              </SidebarProvider>
            } />
            <Route path="/gestionare-vehicule" element={
              <SidebarProvider>
                <GestionareVehicule />
              </SidebarProvider>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
