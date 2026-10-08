import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * Suzy's Cleaners design tokens.
 *
 * Brand navy + royal blue come from the Suzy's logo, the warm orange CTA and
 * sunshine yellow from the approved app mockups. Cream, beige and a muted gold
 * carry the luxury garment-care feel across surfaces.
 */
export const colors = {
  navy900: '#0A1F44',
  navy: '#12306B',
  navy700: '#1B3F86',
  royal: '#1F57B8',
  sky: '#E8F0FB',
  skySoft: '#F2F6FC',

  gold: '#C6A05A',
  goldSoft: '#F3E9D3',
  sunshine: '#FFD23F',
  sunshineSoft: '#FFF4CC',
  orange: '#F29A2E',
  orangeDeep: '#E5821A',

  cream: '#FAF6EE',
  ivory: '#FFFDF8',
  beige: '#EFE6D6',
  sand: '#E3D7C1',
  white: '#FFFFFF',

  ink: '#0F1729',
  text: '#1D2840',
  muted: '#6B7385',
  faint: '#9AA1B0',
  border: '#E8E1D4',
  hairline: '#EFEAE0',

  success: '#1F9D57',
  successSoft: '#E3F5EA',
  warning: '#C77A12',
  warningSoft: '#FDF0DC',
  danger: '#C53B3B',
  dangerSoft: '#FBE6E6',
  info: '#1F6FD1',
  infoSoft: '#E3EEFC',

  overlay: 'rgba(10, 31, 68, 0.45)',
};

export const fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  displayMedium: 'PlayfairDisplay_600SemiBold',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
};

export const type: Record<string, TextStyle> = {
  hero: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.navy900, letterSpacing: -0.3 },
  h1: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.navy900 },
  h2: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27, color: colors.navy900 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 23, color: colors.navy900 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.muted },
  smallStrong: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.text },
  caption: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.muted, letterSpacing: 1.2, textTransform: 'uppercase' },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 20 },
};

export const shadow = (level: 1 | 2 | 3 = 1): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.navy900,
      shadowOpacity: [0, 0.06, 0.1, 0.16][level],
      shadowRadius: [0, 10, 18, 28][level],
      shadowOffset: { width: 0, height: [0, 4, 8, 14][level] },
    },
    android: { elevation: [0, 2, 5, 10][level] },
    default: {
      boxShadow: `0px ${[0, 4, 8, 14][level]}px ${[0, 14, 24, 36][level]}px rgba(10,31,68,${[0, 0.07, 0.1, 0.16][level]})`,
    } as ViewStyle,
  })!;

export const theme = { colors, fonts, spacing, radius, type, shadow };
export type Theme = typeof theme;
