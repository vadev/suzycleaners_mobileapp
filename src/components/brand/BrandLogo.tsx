import { Image } from 'expo-image';
import { logo } from './images';

/** The Suzy's Cleaners mascot logo. Aspect ratio 340:240. */
export function BrandLogo({ width = 260 }: { width?: number }) {
  return (
    <Image
      source={logo}
      style={{ width, height: (width * 240) / 340, alignSelf: 'center' }}
      contentFit="contain"
      accessibilityLabel="Suzy's Cleaners, established 1996"
    />
  );
}
