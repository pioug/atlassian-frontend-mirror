import {
  AlignmentMarkDefinition,
  AlignmentAttributes,
  ParagraphDefinition,
  HeadingDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark, WithAppliedMark } from '../types';

export const alignment = (attrs: AlignmentAttributes) => (
  maybeNode: WithMark | string,
) =>
  applyMark<AlignmentMarkDefinition>(
    { type: 'alignment', attrs },
    maybeNode,
  ) as WithAppliedMark<
    ParagraphDefinition | HeadingDefinition,
    AlignmentMarkDefinition
  >;
