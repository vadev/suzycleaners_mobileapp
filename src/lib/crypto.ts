import * as Crypto from 'expo-crypto';

export const uid = () => Crypto.randomUUID();

export const randomSalt = () =>
  Array.from(Crypto.getRandomBytes(12))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

/** Salted SHA-256. Demo only — production auth providers handle hashing server-side (bcrypt/argon2). */
export const hashPassword = (salt: string, password: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);

/** Constant-time-ish comparison for hex digests. */
export const safeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};
