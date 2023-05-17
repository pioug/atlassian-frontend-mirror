export type Highlights = Array<'wide' | 'full-width' | number>;

export type GridPluginState = {
  visible: boolean;
  gridType?: GridType;
  highlight: Highlights;
};

export type GridType = 'full' | 'wrapped';
