import type { EmDefinition } from '@atlaskit/adf-schema/em';
import type { TextDefinition } from '@atlaskit/adf-schema/text';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const em = (maybeNode: WithMark | string): WithMark | TextDefinition => {
	return applyMark<EmDefinition>({ type: 'em' }, maybeNode);
};
