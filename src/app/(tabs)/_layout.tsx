import Tabs from 'expo-router/js-tabs';
import { FloatingTabBar, type TabSpec } from '@/components/TabBar';
import { useMyMessages } from '@/hooks/data';
import { colors } from '@/theme';

export default function CustomerTabs() {
  const { messages } = useMyMessages();
  const unread = messages.filter((m) => !m.readByCustomer).length;

  const specs: Record<string, TabSpec> = {
    index: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    services: { label: 'Services', icon: 'hanger', activeIcon: 'hanger' },
    orders: { label: 'Orders', icon: 'file-document-outline', activeIcon: 'file-document' },
    messages: { label: 'Messages', icon: 'message-processing-outline', activeIcon: 'message-processing', badge: unread || undefined },
    account: { label: 'Account', icon: 'account-outline', activeIcon: 'account' },
  };

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
      tabBar={(props) => <FloatingTabBar {...props} specs={specs} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="services" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
