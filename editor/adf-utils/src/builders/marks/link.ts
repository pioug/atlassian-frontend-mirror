import type { LinkDefinition, LinkAttributes } from '@atlaskit/adf-schema/link';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const link =
	(attrs: LinkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<LinkDefinition>({ type: 'link', attrs }, maybeNode);
