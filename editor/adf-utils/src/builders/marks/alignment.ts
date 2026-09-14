import type { AlignmentMarkDefinition, AlignmentAttributes } from '@atlaskit/adf-schema/alignment';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import type { HeadingDefinition } from '@atlaskit/adf-schema/heading';
import { applyMark } from '../utils/apply-mark';
import type { WithMark, WithAppliedMark } from '../types';

export const alignment = (attrs: AlignmentAttributes) => (maybeNode: WithMark | string) =>
	applyMark<AlignmentMarkDefinition>({ type: 'alignment', attrs }, maybeNode) as WithAppliedMark<
		ParagraphDefinition | HeadingDefinition,
		AlignmentMarkDefinition
	>;
