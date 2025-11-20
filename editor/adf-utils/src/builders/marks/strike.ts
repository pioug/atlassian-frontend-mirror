import { type StrikeDefinition, type TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const strike = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<StrikeDefinition>({ type: 'strike' }, maybeNode);
