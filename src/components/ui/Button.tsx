import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radius, shadow } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Variant = 'primary' | 'dark' | 'gold' | 'outline' | 'ghost' | 'danger';

const palette: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.orange, fg: colors.white },
  dark: { bg: colors.navy, fg: colors.white },
  gold: { bg: colors.sunshine, fg: colors.navy900 },
  outline: { bg: colors.white, fg: colors.navy, border: colors.navy },
  ghost: { bg: 'transparent', fg: colors.navy },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
};

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: string;
  size?: 'lg' | 'md' | 'sm';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function Button({ title, onPress, variant = 'primary', icon, size = 'lg', loading, disabled, style, accessibilityHint }: ButtonProps) {
  const p = palette[variant];
  const height = size === 'lg' ? 58 : size === 'md' ? 48 : 38;
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: p.bg,
          borderColor: p.border ?? 'transparent',
          borderWidth: p.border ? 1.5 : 0,
          borderRadius: size === 'sm' ? radius.md : radius.lg,
          paddingHorizontal: size === 'sm' ? 14 : 22,
          opacity: inactive ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        (variant === 'primary' || variant === 'dark') && shadow(2),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={size === 'sm' ? 17 : 21} color={p.fg} /> : null}
          <AppText
            variant="button"
            style={{ color: p.fg, fontSize: size === 'lg' ? 17 : size === 'md' ? 15 : 13.5, fontFamily: fonts.semibold }}
            numberOfLines={1}
          >
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
