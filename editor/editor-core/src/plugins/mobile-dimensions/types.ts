export type MobileDimensionsPluginState = {
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number;
  /** Current value of window.innerHeight, on Android this changes when keyboards shows/hides */
  windowHeight: number;
  /** Current value of padding top set from native (see WebBridge abstract class implementation) */
  mobilePaddingTop: number;
};
