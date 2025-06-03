
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, Calendar, CreditCard } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'reservation_expiring' | 'payment_overdue' | 'vehicle_maintenance';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    const newNotifications: Notification[] = [];

    // Check for expiring reservations (within 24 hours)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: expiringReservations } = await supabase
      .from('reservations')
      .select(`
        id,
        data_sfarsit,
        clients (nume_complet),
        vehicles (marca, model)
      `)
      .eq('status', 'activa')
      .lte('data_sfarsit', tomorrow.toISOString().split('T')[0]);

    expiringReservations?.forEach(reservation => {
      newNotifications.push({
        id: `expiring_${reservation.id}`,
        type: 'reservation_expiring',
        title: 'Rezervare în curs de expirare',
        message: `Rezervarea pentru ${reservation.clients?.nume_complet} (${reservation.vehicles?.marca} ${reservation.vehicles?.model}) expiră în curând`,
        data: reservation,
        isRead: false,
        createdAt: new Date()
      });
    });

    // Check for overdue payments
    const { data: overduePayments } = await supabase
      .from('transactions')
      .select(`
        id,
        suma,
        reservations (
          clients (nume_complet),
          vehicles (marca, model)
        )
      `)
      .eq('status', 'neplatit')
      .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    overduePayments?.forEach(payment => {
      newNotifications.push({
        id: `overdue_${payment.id}`,
        type: 'payment_overdue',
        title: 'Plată întârziată',
        message: `Plata de ${Math.round(payment.suma)} RON pentru ${payment.reservations?.clients?.nume_complet} este întârziată`,
        data: payment,
        isRead: false,
        createdAt: new Date()
      });
    });

    setNotifications(newNotifications);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reservation_expiring':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'payment_overdue':
        return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'vehicle_maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notificări</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} noi</Badge>
            )}
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nu există notificări noi
              </p>
            ) : (
              notifications.map(notification => (
                <Card 
                  key={notification.id} 
                  className={`p-3 ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="mt-2 h-6 text-xs"
                    >
                      Marchează ca citit
                    </Button>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
