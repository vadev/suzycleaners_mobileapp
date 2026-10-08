import { Switch, type SwitchProps } from 'react-native';
import { colors } from '@/theme';

/** Brand-styled switch (consistent on iOS, Android and web). */
export function Toggle(props: SwitchProps) {
  const webProps = { activeThumbColor: colors.white, activeTrackColor: colors.navy } as object;
  return (
    <Switch
      trackColor={{ true: colors.navy, false: colors.sand }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.sand}
      {...webProps}
      {...props}
    />
  );
}
