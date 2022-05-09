export function checkIfMobileBridge() {
  /**
   * This variable is setup on mobile prior to the editor being
   * rendered.
   *
   * -- packages/editor/editor-mobile-bridge/src/editor/native-to-web/bridge-initialiser.ts
   * - packages/editor/editor-mobile-bridge/src/__tests__/integration-webview/_mocks/editor-component.tsx
   */
  const isMobileBridge =
    typeof window !== 'undefined' &&
    'bridge' in window &&
    // @ts-ignore
    'mediaMap' in window.bridge;

  return isMobileBridge;
}
