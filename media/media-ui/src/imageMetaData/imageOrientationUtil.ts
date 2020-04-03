const ORIENT_TRANSFORMS: { [key: number]: string } = {
  1: 'none', // Horizontal (normal)
  2: 'rotateY(180deg)', // Mirror horizontal
  3: 'rotate(180deg)', // Rotate 180
  4: 'rotate(180deg) rotateY(180deg)', // Mirror vertical
  5: 'rotate(270deg) rotateY(180deg)', // Mirror horizontal and rotate 270 CW
  6: 'rotate(90deg)', // Rotate 90 CW
  7: 'rotate(90deg) rotateY(180deg)', // Mirror horizontal and rotate 90 CW
  8: 'rotate(270deg)', // Rotate 270 CW
};

/**
 * Returns true if image rotated 90 or 270 degrees (on it's side)
 */
export const isRotated = (orientation: number) => orientation >= 5;

export const getCssFromImageOrientation = (orientation: number): string => {
  return ORIENT_TRANSFORMS[orientation];
};
