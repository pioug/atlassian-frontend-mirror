export type ContextProps = {
  useResizeObserverWidthProvider?: boolean;
};

export type WidthObserverProps = {
  setWidth: (width: number) => void;
  /**
   * Whether to limit update events to when the sentinel element is in the viewport.
   * Set this to true for cases where the sentinel scrolls off screen but you still need width udpates.
   * Defaults to false
   * */
  offscreen?: boolean;
};
