import {
  type BreakoutMarkAttrs,
  type BreakoutMarkDefinition,
  type CodeBlockDefinition,
  type LayoutSectionDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithAppliedMark } from '../types';

export const breakout =
  (attrs: BreakoutMarkAttrs) =>
  (maybeNode: CodeBlockDefinition | LayoutSectionDefinition) => {
    return applyMark<BreakoutMarkDefinition>(
      { type: 'breakout', attrs },
      maybeNode,
    ) as WithAppliedMark<typeof maybeNode, BreakoutMarkDefinition>;
  };
