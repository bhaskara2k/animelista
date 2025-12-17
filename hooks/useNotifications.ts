
import { useState, useEffect, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações desktop.');
      setPermission('denied'); // Or handle as unsupported
      return;
    }
    setPermission(Notification.permission as NotificationPermission);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações.');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      alert('As notificações foram bloqueadas. Por favor, habilite-as nas configurações do seu navegador.');
      setPermission('denied');
      return 'denied';
    }
    
    // Notification.permission is 'default'
    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result as NotificationPermission;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      setPermission('denied'); // Assume denied on error
      return 'denied';
    }
  }, []);

  return { permission, requestNotificationPermission };
};
