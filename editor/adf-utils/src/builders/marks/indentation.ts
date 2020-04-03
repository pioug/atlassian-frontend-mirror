import {
  IndentationMarkDefinition,
  IndentationMarkAttributes,
  ParagraphDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { WithMark, WithAppliedMark } from '../types';

export const indentation = (attrs: IndentationMarkAttributes) => (
  maybeNode: WithMark | string,
) =>
  applyMark<IndentationMarkDefinition>(
    { type: 'indentation', attrs },
    maybeNode,
  ) as WithAppliedMark<ParagraphDefinition, IndentationMarkDefinition>;
