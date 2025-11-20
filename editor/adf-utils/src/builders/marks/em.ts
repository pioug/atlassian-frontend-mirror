import { type EmDefinition, type TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const em = (maybeNode: WithMark | string): WithMark | TextDefinition => {
	return applyMark<EmDefinition>({ type: 'em' }, maybeNode);
};
