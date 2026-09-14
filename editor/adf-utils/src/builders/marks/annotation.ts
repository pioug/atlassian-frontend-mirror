import type {
	AnnotationMarkDefinition,
	AnnotationMarkAttributes,
} from '@atlaskit/adf-schema/annotation';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const annotation =
	(attrs: AnnotationMarkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<AnnotationMarkDefinition>({ type: 'annotation', attrs }, maybeNode);
