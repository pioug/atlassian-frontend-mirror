import { DecorationSet } from 'prosemirror-view';
import { DecorationSetBuilder } from './types';

export const buildDecorationSet = (
  builders: Array<DecorationSetBuilder>,
): DecorationSetBuilder => ({ decorationSet, tr }): DecorationSet =>
  builders.reduce(
    (decorationSet, transform) => transform({ decorationSet, tr }),
    decorationSet,
  );

export const noop: DecorationSetBuilder = ({ decorationSet }) => decorationSet;
