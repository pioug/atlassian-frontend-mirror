export type MobileDimensionsPluginState = {
  /** Current value of window.innerHeight, on Android this changes when keyboards shows/hides */
  windowHeight: number;
  /** Current value of padding top set from native (see WebBridge abstract class implementation) */
  mobilePaddingTop: number;
  /** Hybrid editor is always expanded, compact editor is collapsed or expanded */
  isExpanded: boolean;
};
