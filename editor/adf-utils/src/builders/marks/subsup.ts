import { type SubSupDefinition, type SubSupAttributes } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const subsup = (attrs: SubSupAttributes) => (maybeNode: WithMark | string) =>
	applyMark<SubSupDefinition>({ type: 'subsup', attrs }, maybeNode);
