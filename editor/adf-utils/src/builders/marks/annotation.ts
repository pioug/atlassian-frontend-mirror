import { type AnnotationMarkDefinition, type AnnotationMarkAttributes } from '@atlaskit/adf-schema';
import { applyMark } from '../utils/apply-mark';
import { type WithMark } from '../types';

export const annotation = (attrs: AnnotationMarkAttributes) => (maybeNode: WithMark | string) =>
	applyMark<AnnotationMarkDefinition>({ type: 'annotation', attrs }, maybeNode);
