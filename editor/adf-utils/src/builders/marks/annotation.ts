import type {
	AnnotationMarkDefinition,
	AnnotationMarkAttributes,
} from '@atlaskit/adf-schema/annotation';
import type { TextDefinition } from '@atlaskit/adf-schema/text';

import type { WithMark } from '../types';
import { applyMark } from '../utils/apply-mark';

export const annotation =
	(attrs: AnnotationMarkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<AnnotationMarkDefinition>({ type: 'annotation', attrs }, maybeNode);
