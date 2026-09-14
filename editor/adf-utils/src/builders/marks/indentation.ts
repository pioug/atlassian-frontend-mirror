import type {
	IndentationMarkDefinition,
	IndentationMarkAttributes,
} from '@atlaskit/adf-schema/indentation';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import { applyMark } from '../utils/apply-mark';
import type { WithMark, WithAppliedMark } from '../types';

export const indentation = (attrs: IndentationMarkAttributes) => (maybeNode: WithMark | string) =>
	applyMark<IndentationMarkDefinition>(
		{ type: 'indentation', attrs },
		maybeNode,
	) as WithAppliedMark<ParagraphDefinition, IndentationMarkDefinition>;
