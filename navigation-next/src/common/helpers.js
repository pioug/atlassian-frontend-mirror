export function applyDisabledProperties(disableInteraction) {
  return disableInteraction
    ? {
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : null;
}
