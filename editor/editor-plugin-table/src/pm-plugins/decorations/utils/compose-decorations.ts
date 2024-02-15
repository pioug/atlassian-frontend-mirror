import type { DecorationTransformer } from './types';

export const composeDecorations =
  (transformers: Array<DecorationTransformer>): DecorationTransformer =>
  ({ decorationSet, tr }) =>
    transformers.reduce(
      (decorationSet, transform) => transform({ decorationSet, tr }),
      decorationSet,
    );
