import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Extra bottom space so content clears the floating tab bar. */
  tabBarSpace?: boolean;
  padded?: boolean;
  background?: 'cream' | 'sky' | 'white';
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: ('top' | 'bottom')[];
  footer?: ReactNode;
}

export const TAB_BAR_SPACE = 110;

export function Screen({
  children,
  scroll = true,
  tabBarSpace,
  padded = true,
  background = 'cream',
  contentStyle,
  refreshing,
  onRefresh,
  edges = ['top'],
  footer,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const top = edges.includes('top') ? insets.top : 0;
  const bottom = (edges.includes('bottom') ? insets.bottom : 0) + (tabBarSpace ? TAB_BAR_SPACE : spacing.xl);
  const gradient =
    background === 'sky'
      ? ([colors.sky, colors.skySoft, colors.cream] as const)
      : background === 'white'
        ? ([colors.white, colors.white] as const)
        : ([colors.ivory, colors.cream] as const);

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingTop: top, paddingBottom: bottom }, padded && styles.padded, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.navy} /> : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingTop: top }, padded && styles.padded, contentStyle]}>{children}</View>
      )}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  padded: { paddingHorizontal: spacing.md },
});
