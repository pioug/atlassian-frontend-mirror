// =============================================================
// NOTE: Duplicated in ../index and ../stateless until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

export const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

const appearancesMap = {
  default: 'standard',
  subtle: 'subtle',
};

export const mapAppearanceToFieldBase = appearance =>
  appearancesMap[appearance];
