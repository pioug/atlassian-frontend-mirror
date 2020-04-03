export interface PlaceholderTextOptions {
  allowInserting?: boolean;
}

export interface PluginState {
  showInsertPanelAt: number | null;
  // Enables the "Insert Placeholder Text" dropdown item
  allowInserting: boolean;
}
