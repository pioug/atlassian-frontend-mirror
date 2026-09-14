import type { BorderMarkDefinition, BorderMarkAttributes } from '@atlaskit/adf-schema/border';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const border =
	(attrs: BorderMarkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<BorderMarkDefinition>({ type: 'border', attrs }, maybeNode);
