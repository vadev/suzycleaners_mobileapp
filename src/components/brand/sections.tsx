import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon } from '@/components/ui';
import { TRUST_BADGES } from '@/config/business';
import { colors, fonts, radius, shadow, spacing } from '@/theme';
import type { ServiceItem, StoreLocation } from '@/types';
import { serviceImages } from './images';

export function TrustBar() {
  return (
    <View style={styles.trust}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trustInner}>
        {TRUST_BADGES.map((b) => (
          <View key={b} style={styles.trustItem}>
            <Icon name="check" size={15} color={colors.sunshine} />
            <AppText style={styles.trustText}>{b}</AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function TaglineBanner() {
  return (
    <View style={styles.tagline}>
      <AppText style={styles.taglineText}>You Take Care of Life.</AppText>
      <AppText style={styles.taglineText}>We Take Care of Your Clothes.</AppText>
    </View>
  );
}

export function ServiceTile({ service, width = 104 }: { service: ServiceItem; width?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={service.name}
      onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}
      style={({ pressed }) => [{ width, gap: 8 }, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.tileImgWrap, shadow(1)]}>
        <Image source={serviceImages[service.image]} style={{ width, height: width * 1.45 }} contentFit="cover" transition={250} />
      </View>
      <AppText style={styles.tileLabel} numberOfLines={2}>
        {service.name.replace('Luxury ', '').replace(' & Alterations', '')}
      </AppText>
    </Pressable>
  );
}

export function ChamberCard({ compact }: { compact?: boolean }) {
  return (
    <Card style={[styles.halfCard, compact && { flex: 1 }]}>
      <View style={styles.chamberMark}>
        <View style={styles.chamberArc} />
        <AppText style={styles.chamberWord}>Burbank</AppText>
        <AppText style={styles.chamberSub} numberOfLines={1} adjustsFontSizeToFit>
          CHAMBER OF COMMERCE
        </AppText>
        <View style={styles.goldRule} />
      </View>
      <AppText variant="h3" style={{ fontSize: 16 }}>
        Proud Chamber Member
      </AppText>
      <AppText variant="small">Supporting a stronger Burbank business community.</AppText>
    </Card>
  );
}

export function ComingSoonCard({ locations, compact }: { locations: StoreLocation[]; compact?: boolean }) {
  const soon = locations.filter((l) => l.status === 'coming_soon');
  return (
    <Card tone="sky" style={[styles.halfCard, compact && { flex: 1 }, { alignItems: 'center' }]}>
      <View style={styles.mapIcon}>
        <Icon name="map-marker-radius" size={30} color={colors.navy} />
      </View>
      <AppText variant="h2" style={{ fontSize: 19 }}>
        Coming Soon
      </AppText>
      <View style={{ gap: 6, alignSelf: 'center' }}>
        {soon.map((l) => (
          <View key={l.id} style={styles.soonRow}>
            <Icon name="map-marker" size={18} color={colors.orange} />
            <AppText variant="bodyStrong" style={{ color: colors.navy900 }}>
              {l.name}
            </AppText>
          </View>
        ))}
      </View>
      <View style={styles.soonRule} />
      <AppText variant="small" style={{ textAlign: 'center' }}>
        More locations coming soon!
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  trust: { backgroundColor: colors.navy, borderRadius: radius.md, marginTop: spacing.md, overflow: 'hidden' },
  trustInner: { paddingHorizontal: spacing.md, paddingVertical: 12, gap: spacing.md },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { color: colors.white, fontFamily: fonts.medium, fontSize: 12 },
  tagline: {
    backgroundColor: colors.sunshine,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  taglineText: { fontFamily: fonts.display, fontSize: 21, lineHeight: 28, color: colors.navy900, textAlign: 'center' },
  tileImgWrap: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.beige },
  tileLabel: { fontFamily: fonts.semibold, fontSize: 11.5, lineHeight: 14, color: colors.navy900, textAlign: 'center' },
  halfCard: { gap: 6, minHeight: 200, justifyContent: 'center' },
  chamberMark: { alignItems: 'center', marginBottom: spacing.xs },
  chamberArc: { width: 96, height: 14, borderTopLeftRadius: 60, borderTopRightRadius: 60, borderTopWidth: 3, borderColor: colors.royal, marginBottom: -2 },
  chamberWord: { fontFamily: 'PlayfairDisplay_700Bold_Italic', fontSize: 30, color: colors.ink, lineHeight: 36 },
  chamberSub: { fontFamily: fonts.medium, fontSize: 8, letterSpacing: 0.9, color: colors.ink },
  goldRule: { width: 32, height: 2, backgroundColor: colors.orange, marginTop: 8, borderRadius: 1 },
  mapIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  soonRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  soonRule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.sand, alignSelf: 'stretch', marginVertical: 6 },
});
