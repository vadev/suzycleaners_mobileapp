import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  tone?: 'white' | 'cream' | 'sky' | 'navy';
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const tones = {
  white: colors.white,
  cream: colors.ivory,
  sky: colors.sky,
  navy: colors.navy,
};

export function Card({ onPress, tone = 'white', padded = true, style, children, accessibilityLabel, ...rest }: CardProps) {
  const base = [styles.card, { backgroundColor: tones[tone] }, padded && styles.padded, tone === 'white' && shadow(1), style];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [...base, pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] }]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View {...rest} style={base}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  padded: { padding: spacing.lg },
});
