import type {
	FontSizeMarkAttrs,
	FontSizeMarkDefinition,
	ParagraphDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark, WithAppliedMark } from '../types';

export const fontSize = (attrs: FontSizeMarkAttrs) => (maybeNode: WithMark | string) =>
	applyMark<FontSizeMarkDefinition>({ type: 'fontSize', attrs }, maybeNode) as WithAppliedMark<
		ParagraphDefinition,
		FontSizeMarkDefinition
	>;
