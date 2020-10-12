export interface Color {
  label: string;
  value: string;
}

export type Palette = Color[];

export enum Mode {
  Compact,
  Standard,
}
