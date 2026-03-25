import type { SubSupDefinition, SubSupAttributes, TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const subsup =
	(attrs: SubSupAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<SubSupDefinition>({ type: 'subsup', attrs }, maybeNode);
