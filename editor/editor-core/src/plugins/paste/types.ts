export interface PastePluginState {
  /** map of pasted macro link positions that will to be mapped through incoming transactions */
  pastedMacroPositions: { [key: string]: number };
}
