import type { LinkDefinition, LinkAttributes, TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const link =
	(attrs: LinkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<LinkDefinition>({ type: 'link', attrs }, maybeNode);
