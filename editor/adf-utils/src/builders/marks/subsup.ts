import {
	type SubSupDefinition,
	type SubSupAttributes,
	type TextDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const subsup =
	(attrs: SubSupAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<SubSupDefinition>({ type: 'subsup', attrs }, maybeNode);
