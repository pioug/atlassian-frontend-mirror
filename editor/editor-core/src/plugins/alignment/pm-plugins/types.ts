export type AlignmentState = 'start' | 'end' | 'center';
export type AlignmentPluginState = {
  align: AlignmentState;
  isEnabled?: boolean;
};
