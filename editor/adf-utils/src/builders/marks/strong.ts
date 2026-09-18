import type { StrongDefinition } from '@atlaskit/adf-schema/strong';
import type { TextDefinition } from '@atlaskit/adf-schema/text';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const strong = (maybeNode: WithMark | string): WithMark | TextDefinition =>
	applyMark<StrongDefinition>({ type: 'strong' }, maybeNode);
