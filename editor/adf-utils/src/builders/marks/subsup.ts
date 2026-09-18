import type { SubSupDefinition, SubSupAttributes } from '@atlaskit/adf-schema/subsup';
import type { TextDefinition } from '@atlaskit/adf-schema/text';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const subsup =
	(attrs: SubSupAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<SubSupDefinition>({ type: 'subsup', attrs }, maybeNode);
