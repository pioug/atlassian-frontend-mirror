export type ScrollValue =
  | number
  | { top: number; bottom: number; left: number; right: number };
export type MobileScrollPluginState = {
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number;
  /**
   * Diff in height between document.scrollingElement and window.innerHeight
   * iOS has some weird behaviour where the value of window.innerHeight changes as the
   * user scrolls - we need to factor this into our calculations
   */
  heightDiff: number;
  /** Current value of window.innerHeight, on Android this changes when keyboards shows/hides */
  windowHeight: number;
  /** Current value of padding top set from native (see WebBridge abstract class implementation) */
  mobilePaddingTop: number;
};
