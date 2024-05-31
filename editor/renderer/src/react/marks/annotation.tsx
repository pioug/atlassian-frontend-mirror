import React from 'react';
import type { AnnotationDataAttributes } from '@atlaskit/adf-schema';
import { buildAnnotationMarkDataAttributes } from '@atlaskit/adf-schema';
import type { MarkProps, AnnotationMarkMeta } from '../types';
import { AnnotationMark } from '../../ui/annotations';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

export const isAnnotationMark = (mark: Mark): boolean => {
	return mark && mark.type && mark.type.name === 'annotation';
};

const AnnotationComponent = ({
	id,
	annotationType,
	children,
	dataAttributes,
	annotationParentIds = [],
	allowAnnotations,
	useBlockLevel,
	isMediaInline,
}: MarkProps<AnnotationMarkMeta>) => {
	const data: AnnotationDataAttributes = {
		...dataAttributes,
		...buildAnnotationMarkDataAttributes({ id, annotationType }),
	};

	if (allowAnnotations) {
		return isMediaInline ? (
			// Inline comment on mediaInline is not supported as part of comments on media project,
			// hence skip any styling/event handling for annotations on mediaInline.
			// `id` is still needed so that comment view component can be correct positioned
			// when using comment navigation to access comments on mediaInline
			<span id={id}>{children}</span>
		) : (
			<AnnotationMark
				id={id}
				dataAttributes={data}
				annotationParentIds={annotationParentIds}
				annotationType={annotationType}
				useBlockLevel={useBlockLevel}
			>
				{children}
			</AnnotationMark>
		);
	}

	return (
		<span id={id} {...data}>
			{children}
		</span>
	);
};

export default AnnotationComponent;
