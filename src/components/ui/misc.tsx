import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon } from './Icon';

export function SectionHeader({ title, action, onAction, eyebrow }: { title: string; action?: string; onAction?: () => void; eyebrow?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <AppText variant="caption" style={{ color: colors.gold }}>{eyebrow}</AppText> : null}
        <AppText variant="h2">{title}</AppText>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="button">
          <AppText variant="smallStrong" style={{ color: colors.royal }}>
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }, style]} />;
}

export function ListRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
  chevron = !!onPress,
  danger,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  danger?: boolean;
}) {
  const content = (
    <View style={styles.row}>
      {icon ? (
        <View style={[styles.rowIcon, danger && { backgroundColor: colors.dangerSoft }]}>
          <Icon name={icon} size={20} color={danger ? colors.danger : colors.navy} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" style={danger ? { color: colors.danger } : undefined} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      {chevron ? <Icon name="chevron-right" size={22} color={colors.faint} /> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
      {content}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, icon, style }: { label: string; selected?: boolean; onPress?: () => void; icon?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={selected ? colors.navy900 : colors.muted} /> : null}
      <AppText style={[styles.chipText, selected && { color: colors.navy900, fontFamily: fonts.semibold }]} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxOn]}>
      {checked ? <Icon name="check-bold" size={15} color={colors.white} /> : null}
    </View>
  );
}

export function Stepper({ value, onChange, min = 0, max = 99 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        hitSlop={8}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={styles.stepBtn}
      >
        <Icon name="minus" size={16} />
      </Pressable>
      <AppText variant="bodyStrong" style={{ minWidth: 22, textAlign: 'center' }}>
        {value}
      </AppText>
      <Pressable
        accessibilityLabel="Increase quantity"
        hitSlop={8}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={styles.stepBtn}
      >
        <Icon name="plus" size={16} />
      </Pressable>
    </View>
  );
}

export function EmptyState({ icon, title, body, action, onAction }: { icon: string; title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={30} color={colors.gold} />
      </View>
      <AppText variant="h2" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      {body ? (
        <AppText variant="body" style={{ textAlign: 'center', color: colors.muted }}>
          {body}
        </AppText>
      ) : null}
      {action ? <Button title={action} onPress={onAction} size="md" style={{ marginTop: spacing.sm, alignSelf: 'stretch' }} /> : null}
    </View>
  );
}

export function Pill({ label, color, bg, icon }: { label: string; color: string; bg: string; icon?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      {icon ? <Icon name={icon} size={14} color={color} /> : null}
      <AppText style={[styles.pillText, { color }]} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <AppText style={{ fontFamily: fonts.semibold, color: colors.navy, fontSize: size * 0.36 }}>{letters}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.xl, marginBottom: spacing.sm, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.skySoft, alignItems: 'center', justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.skySoft,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  chipSelected: { backgroundColor: colors.sunshine, borderColor: colors.sunshine },
  chipText: { fontFamily: fonts.medium, fontSize: 14.5, color: colors.text },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.sand,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.skySoft, borderRadius: radius.pill, padding: 4 },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, alignSelf: 'flex-start' },
  pillText: { fontFamily: fonts.semibold, fontSize: 12.5 },
  avatar: { backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.sand },
});
