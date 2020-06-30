import { DecorationSet } from 'prosemirror-view';

import { DecorationTransformer } from './types';

export const composeDecorations = (
  transformers: Array<DecorationTransformer>,
): DecorationTransformer => ({ decorationSet, tr }): DecorationSet =>
  transformers.reduce(
    (decorationSet, transform) => transform({ decorationSet, tr }),
    decorationSet,
  );
