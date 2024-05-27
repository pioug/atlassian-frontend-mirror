import {
  type IndentationMarkDefinition,
  type IndentationMarkAttributes,
  type ParagraphDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark, type WithAppliedMark } from '../types';

export const indentation =
  (attrs: IndentationMarkAttributes) => (maybeNode: WithMark | string) =>
    applyMark<IndentationMarkDefinition>(
      { type: 'indentation', attrs },
      maybeNode,
    ) as WithAppliedMark<ParagraphDefinition, IndentationMarkDefinition>;
