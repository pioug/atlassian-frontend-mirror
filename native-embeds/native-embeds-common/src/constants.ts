export const ALIGNMENT_VALUES = ['left', 'center', 'right', 'wrap-left', 'wrap-right'] as const;

/** Alignment value for native embed extension parameters. Single source of truth. */
export type AlignmentValue = (typeof ALIGNMENT_VALUES)[number];

/** Default alignment when not set in parameters. */
export const DEFAULT_ALIGNMENT: AlignmentValue = 'center';
