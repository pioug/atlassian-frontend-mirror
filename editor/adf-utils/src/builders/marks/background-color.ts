import type { BackgroundColorDefinition } from '@atlaskit/adf-schema/background-color';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import type { TextColorAttributes } from '@atlaskit/adf-schema/text-color';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const backgroundColor =
	(attrs: TextColorAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<BackgroundColorDefinition>({ type: 'backgroundColor', attrs }, maybeNode);
