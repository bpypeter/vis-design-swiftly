
import { 
  Home, 
  User, 
  Calendar, 
  FileText, 
  Car,
  CarIcon as Return,
  CreditCard,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Client nou",
    url: "/client-nou",
    icon: User,
  },
  {
    title: "Rezervare vehicul",
    url: "/rezervare-vehicul",
    icon: Calendar,
  },
  {
    title: "Documente",
    url: "/documente",
    icon: FileText,
  },
  {
    title: "Returnare vehicul",
    url: "/returnare-vehicul",
    icon: Return,
  },
  {
    title: "Plată & Factură",
    url: "/plata-factura",
    icon: CreditCard,
  },
  {
    title: "Rapoarte",
    url: "/rapoarte",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="bg-blue-700 border-none">
      <SidebarContent className="bg-blue-700">
        <div className="p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Car className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-xl font-bold">AUTONOM</h1>
              <p className="text-blue-200 text-sm">Închirieri Auto</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`text-white hover:bg-blue-600 ${
                      location.pathname === item.url ? 'bg-blue-600' : ''
                    }`}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center space-x-3 p-3"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
