import type { TextDefinition } from '@atlaskit/adf-schema/text';
import type { UnderlineDefinition } from '@atlaskit/adf-schema/underline';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const underline = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<UnderlineDefinition>({ type: 'underline' }, maybeNode);
