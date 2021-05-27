export const expiresAt = (offsetSeconds: number = 0): number =>
  Math.floor(Date.now() / 1000) + offsetSeconds;
