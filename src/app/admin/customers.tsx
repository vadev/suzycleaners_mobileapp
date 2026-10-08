import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Card, EmptyState, Icon, Screen, ScreenHeader, TextField } from '@/components/ui';
import { useAdminCustomers } from '@/hooks/data';
import { digitsOnly, money, relativeTime } from '@/lib/format';
import { colors, fonts, spacing } from '@/theme';

export default function AdminCustomers() {
  const { customers, loading } = useAdminCustomers();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const d = digitsOnly(s);
    if (!s) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (d.length >= 3 && digitsOnly(c.phone).includes(d)) ||
        c.addresses.some((a) => `${a.line1} ${a.city} ${a.zip}`.toLowerCase().includes(s)),
    );
  }, [customers, q]);

  return (
    <Screen>
      <ScreenHeader title="Customers" subtitle={`${customers.length} customer accounts`} />
      <TextField icon="magnify" placeholder="Search name, phone, email or address" value={q} onChangeText={setQ} autoCapitalize="none" />
      <View style={{ gap: 10, marginTop: spacing.md }}>
        {!loading && list.length === 0 ? <EmptyState icon="account-search-outline" title="No customers found" /> : null}
        {list.map((c) => (
          <Card key={c.id} onPress={() => router.push({ pathname: '/admin/customer/[id]', params: { id: c.id } })} style={styles.row} accessibilityLabel={c.name}>
            <Avatar name={c.name} />
            <View style={{ flex: 1 }}>
              <AppText style={styles.name}>{c.name}</AppText>
              <AppText variant="small">{c.phone}</AppText>
              <AppText variant="small" numberOfLines={1}>
                {c.orderCount} orders · {money(c.lifetimeValue)} · {c.lastOrderAt ? `last ${relativeTime(c.lastOrderAt)}` : 'no orders yet'}
              </AppText>
            </View>
            {c.unreadForAdmin ? (
              <View style={styles.unread}>
                <AppText style={styles.unreadText}>{c.unreadForAdmin}</AppText>
              </View>
            ) : null}
            <Icon name="chevron-right" color={colors.faint} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  name: { fontFamily: fonts.bold, fontSize: 17, color: colors.navy900 },
  unread: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: colors.white, fontFamily: fonts.bold, fontSize: 12 },
});
