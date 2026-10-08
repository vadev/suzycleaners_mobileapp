import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '@/theme';
import { AppText } from './ui/AppText';
import { Icon } from './ui/Icon';

export interface TabSpec {
  label: string;
  icon: string;
  activeIcon: string;
  badge?: number;
}

/** Visible height of the bar itself (without the safe-area inset). */
export const TAB_BAR_HEIGHT = 72;

/** Floating pill tab bar from the approved mockups. */
export function FloatingTabBar({ state, navigation, specs, dark }: BottomTabBarProps & { specs: Record<string, TabSpec>; dark?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, dark && styles.barDark, shadow(3)]}>
        {state.routes.map((route, index) => {
          const spec = specs[route.name];
          if (!spec) return null;
          const focused = state.index === index;
          const tint = dark ? (focused ? colors.sunshine : 'rgba(255,255,255,0.65)') : focused ? colors.royal : colors.muted;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={spec.label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              style={styles.item}
            >
              <View style={[styles.iconWrap, focused && (dark ? styles.activeDark : styles.active)]}>
                <Icon name={focused ? spec.activeIcon : spec.icon} size={25} color={tint} />
                {spec.badge ? (
                  <View style={styles.badge}>
                    <AppText style={styles.badgeText}>{spec.badge > 9 ? '9+' : spec.badge}</AppText>
                  </View>
                ) : null}
              </View>
              <AppText style={[styles.label, { color: tint }, focused && { fontFamily: fonts.semibold }]} numberOfLines={1}>
                {spec.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18 },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 34,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  barDark: { backgroundColor: colors.navy900, borderColor: colors.navy700 },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  iconWrap: { width: 52, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.sky },
  activeDark: { backgroundColor: 'rgba(255,210,63,0.14)' },
  label: { fontFamily: fonts.medium, fontSize: 11.5 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10.5 },
});
