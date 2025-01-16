import {
	type AnnotationTypes,
	annotation,
	type AnnotationDataAttributes,
	type AnnotationMarkAttributes,
} from '@atlaskit/adf-schema';
import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';

function buildDataAttributes({
	id,
	annotationType,
}: AnnotationMarkAttributes): AnnotationDataAttributes {
	return {
		'data-mark-type': 'annotation',
		'data-mark-annotation-type': annotationType,
		'data-id': id,
	};
}

/**
 * Annotation mark lifted from adf-schema with modified `toDOM` to work with
 * existing nodeview
 */
export const annotationWithToDOMFix: MarkSpec = {
	...annotation,
	toDOM: (node) => {
		return [
			'span',
			{
				// Needs id as a reference point
				id: node.attrs.id,
				...buildDataAttributes({
					id: node.attrs.id,
					annotationType: node.attrs.annotationType as AnnotationTypes,
				}),
			},
			0,
		];
	},
};
