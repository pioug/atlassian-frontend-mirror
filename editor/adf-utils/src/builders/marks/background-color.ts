import type {
	BackgroundColorDefinition,
	TextColorAttributes,
	TextDefinition,
} from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const backgroundColor =
	(attrs: TextColorAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<BackgroundColorDefinition>({ type: 'backgroundColor', attrs }, maybeNode);
