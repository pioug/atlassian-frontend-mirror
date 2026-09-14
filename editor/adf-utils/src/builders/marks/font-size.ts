import type { FontSizeMarkAttrs, FontSizeMarkDefinition } from '@atlaskit/adf-schema/font-size';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import { applyMark } from '../utils/apply-mark';
import type { WithMark, WithAppliedMark } from '../types';

export const fontSize = (attrs: FontSizeMarkAttrs) => (maybeNode: WithMark | string) =>
	applyMark<FontSizeMarkDefinition>({ type: 'fontSize', attrs }, maybeNode) as WithAppliedMark<
		ParagraphDefinition,
		FontSizeMarkDefinition
	>;
