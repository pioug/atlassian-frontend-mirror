import { type StrongDefinition, type TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const strong = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<StrongDefinition>({ type: 'strong' }, maybeNode);
