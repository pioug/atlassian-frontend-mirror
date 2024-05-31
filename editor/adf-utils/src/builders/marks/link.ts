import { type LinkDefinition, type LinkAttributes } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const link = (attrs: LinkAttributes) => (maybeNode: WithMark | string) =>
	applyMark<LinkDefinition>({ type: 'link', attrs }, maybeNode);
