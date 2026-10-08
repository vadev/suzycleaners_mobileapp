import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

export function IconButton({ icon, onPress, label, tone = 'light' }: { icon: string; onPress: () => void; label: string; tone?: 'light' | 'dark' }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.iconBtn, tone === 'dark' && styles.iconBtnDark, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={22} color={tone === 'dark' ? colors.white : colors.navy} />
    </Pressable>
  );
}

export function ScreenHeader({ title, subtitle, back = true, right, onBack }: { title: string; subtitle?: string; back?: boolean; right?: ReactNode; onBack?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {back ? (
          <IconButton
            icon="chevron-left"
            label="Back"
            onPress={() => (onBack ? onBack() : router.canGoBack() ? router.back() : router.replace('/'))}
          />
        ) : (
          <View />
        )}
        {right ?? <View />}
      </View>
      <AppText variant="h1">{title}</AppText>
      {subtitle ? <AppText variant="body" style={{ color: colors.muted }}>{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, marginBottom: spacing.md, paddingTop: spacing.xs },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  iconBtnDark: { backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.2)' },
});
