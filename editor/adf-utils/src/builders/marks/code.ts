import type { CodeDefinition } from '@atlaskit/adf-schema/code';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const code = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<CodeDefinition>({ type: 'code' }, maybeNode);
