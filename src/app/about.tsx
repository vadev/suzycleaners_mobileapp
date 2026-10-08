import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { ChamberCard, ComingSoonCard, TaglineBanner } from '@/components/brand/sections';
import { AppText, Button, Card, Icon, Screen, ScreenHeader } from '@/components/ui';
import { TRUST_BADGES } from '@/config/business';
import { useSettings } from '@/hooks/data';
import { colors, spacing } from '@/theme';

const PILLARS = [
  { icon: 'hand-heart-outline', title: 'Hand-finished', body: 'Every garment is inspected, spot-treated and pressed by hand.' },
  { icon: 'leaf', title: 'Eco-friendly options', body: 'Gentle, certified cleaning methods that are kinder to fabrics and the planet.' },
  { icon: 'account-group-outline', title: 'Family owned', body: 'A Burbank family business serving the community since 1996.' },
  { icon: 'truck-fast-outline', title: 'Concierge delivery', body: 'Pickup and delivery at your door, with same-day options.' },
];

export default function About() {
  const { settings } = useSettings();
  return (
    <Screen background="sky">
      <ScreenHeader title="About Us" />
      <BrandLogo width={240} />
      <AppText variant="hero" style={{ textAlign: 'center', marginTop: spacing.sm }}>
        Garment care, the Suzy’s way
      </AppText>
      <AppText variant="body" style={styles.lead}>
        {settings.about}
      </AppText>

      <View style={styles.badges}>
        {TRUST_BADGES.map((b) => (
          <View key={b} style={styles.badge}>
            <Icon name="check-decagram" size={16} color={colors.gold} />
            <AppText variant="smallStrong">{b}</AppText>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        {PILLARS.map((p) => (
          <Card key={p.title} style={styles.pillar}>
            <View style={styles.pillarIcon}>
              <Icon name={p.icon} size={22} color={colors.navy900} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">{p.title}</AppText>
              <AppText variant="small">{p.body}</AppText>
            </View>
          </Card>
        ))}
      </View>

      <TaglineBanner />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {settings.chamberMember ? <ChamberCard compact /> : null}
        <ComingSoonCard locations={settings.locations} compact />
      </View>
      <Button title="Schedule a Pickup" icon="calendar-month-outline" onPress={() => router.push('/schedule')} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { textAlign: 'center', color: colors.text, fontSize: 16, lineHeight: 25, marginTop: spacing.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: spacing.lg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  pillar: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  pillarIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.sunshineSoft, alignItems: 'center', justifyContent: 'center' },
});
