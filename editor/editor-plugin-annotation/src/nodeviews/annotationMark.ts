import { annotation } from '@atlaskit/adf-schema';
import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';

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
				// Used to determine if the annotation is active
				annotationType: node.attrs.annotationType,
				// Below are used for prosemirror (ie. copy/paste behaviour)
				'data-mark-type': 'annotation',
				'data-mark-annotation-type': node.attrs.annotationType,
				'data-id': node.attrs.id,
			},
			0,
		];
	},
};
