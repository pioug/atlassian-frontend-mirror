import type { AlignmentMarkDefinition, AlignmentAttributes } from '@atlaskit/adf-schema/alignment';
import type { HeadingDefinition } from '@atlaskit/adf-schema/heading';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';

import type { WithMark, WithAppliedMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const alignment = (attrs: AlignmentAttributes) => (maybeNode: WithMark | string) =>
	applyMark<AlignmentMarkDefinition>({ type: 'alignment', attrs }, maybeNode) as WithAppliedMark<
		ParagraphDefinition | HeadingDefinition,
		AlignmentMarkDefinition
	>;
