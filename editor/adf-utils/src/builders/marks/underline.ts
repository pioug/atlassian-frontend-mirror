import type { TextDefinition, UnderlineDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const underline = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<UnderlineDefinition>({ type: 'underline' }, maybeNode);
