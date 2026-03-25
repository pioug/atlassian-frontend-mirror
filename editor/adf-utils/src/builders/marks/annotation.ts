import type { AnnotationMarkDefinition, AnnotationMarkAttributes, TextDefinition } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import type { WithMark } from '../types';

export const annotation =
	(attrs: AnnotationMarkAttributes) =>
	(maybeNode: WithMark | string): WithMark | TextDefinition =>
		applyMark<AnnotationMarkDefinition>({ type: 'annotation', attrs }, maybeNode);
