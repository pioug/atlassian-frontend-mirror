import type {
	IndentationMarkDefinition,
	IndentationMarkAttributes,
} from '@atlaskit/adf-schema/indentation';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';

import type { WithMark, WithAppliedMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const indentation = (attrs: IndentationMarkAttributes) => (maybeNode: WithMark | string) =>
	applyMark<IndentationMarkDefinition>(
		{ type: 'indentation', attrs },
		maybeNode,
	) as WithAppliedMark<ParagraphDefinition, IndentationMarkDefinition>;
