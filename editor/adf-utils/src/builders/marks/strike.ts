import { type StrikeDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const strike = (maybeNode: WithMark | string) =>
	applyMark<StrikeDefinition>({ type: 'strike' }, maybeNode);
