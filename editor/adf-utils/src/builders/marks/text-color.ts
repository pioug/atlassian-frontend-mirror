import {
	type TextColorDefinition,
	type TextColorAttributes,
	type TextDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const textColor =
	(attrs: TextColorAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<TextColorDefinition>({ type: 'textColor', attrs }, maybeNode);
