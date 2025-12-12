import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { annotation as annotationFactory } from '../../next-schema/generated/markTypes';

/**
 * @name annotation_mark
 */
export interface AnnotationMarkDefinition {
	attrs: AnnotationMarkAttributes;
	type: 'annotation';
}

export interface AnnotationMarkAttributes {
	annotationType: AnnotationTypes;
	id: AnnotationId;
}

export type AnnotationId = string;
export enum AnnotationTypes {
	INLINE_COMMENT = 'inlineComment',
}
export enum AnnotationMarkStates {
	RESOLVED = 'resolved',
	ACTIVE = 'active',
}

export type AnnotationDataAttributes = {
	'data-id': AnnotationId;
	'data-mark-annotation-state'?: AnnotationMarkStates;
	'data-mark-annotation-type': AnnotationTypes;
	'data-mark-type': string;
};

type BuildDataAttributesProps = AnnotationMarkAttributes & {
	state?: AnnotationMarkStates | undefined | null;
};
export function buildDataAttributes({
	id,
	annotationType,
	state,
}: BuildDataAttributesProps): AnnotationDataAttributes {
	const data = {
		'data-mark-type': 'annotation',
		'data-mark-annotation-type': annotationType,
		'data-id': id,
	};

	if (state) {
		return {
			...data,
			'data-mark-annotation-state': state,
		};
	}

	return data;
}

export const annotation: MarkSpec = annotationFactory({
	parseDOM: [
		{
			tag: 'span[data-mark-type="annotation"]',
			mark: 'annotation',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const attrs: AnnotationMarkAttributes = {
					id: dom.getAttribute('data-id') as string,
					annotationType: dom.getAttribute('data-mark-annotation-type') as AnnotationTypes,
				};

				return attrs;
			},
		},
	],
	toDOM(node) {
		/*
      Data attributes on the DOM node are a temporary means of
      incrementally switching over to the Annotation mark. Once renderer
      provides native support for inline comments the data attributes on the
      DOM nodes will be removed.
    */
		return [
			'span',
			{
				// Prettier will remove the quotes around class. This would cause some browsers
				// to not add this attribute properly, as its a reserved word.
				// prettier-ignore
				'class': 'fabric-editor-annotation',
				...buildDataAttributes({
					id: node.attrs.id as AnnotationId,
					annotationType: node.attrs.annotationType as AnnotationTypes,
				}),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any,
			0,
		];
	},
});
