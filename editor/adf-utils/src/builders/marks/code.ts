import { type CodeDefinition, type TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const code = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<CodeDefinition>({ type: 'code' }, maybeNode);
