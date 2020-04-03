export type GridPluginState = {
  visible: boolean;
  gridType: GridType;
  highlight: number[];
};

export type GridType = 'full' | 'wrapped';
