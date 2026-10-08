import { Text, type TextProps } from 'react-native';
import { type } from '@/theme';

export type TextVariant = keyof typeof type;

export function AppText({ variant = 'body', style, ...rest }: TextProps & { variant?: TextVariant }) {
  return <Text {...rest} style={[type[variant], style]} />;
}
