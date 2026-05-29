// valid hex color with 4, 6 or 8 digits
export const isValidHex = (hex: string): boolean => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
