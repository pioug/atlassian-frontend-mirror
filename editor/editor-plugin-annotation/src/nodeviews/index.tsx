import React from 'react';

import type { ForwardRef } from '@atlaskit/editor-common/react-node-view';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import {
	AnnotationSharedClassNames,
	BlockAnnotationSharedClassNames,
} from '@atlaskit/editor-common/styles';

export class AnnotationNodeView extends ReactNodeView {
	createDomRef() {
		return document.createElement('span');
	}

	getContentDOM() {
		const dom = document.createElement('span');
		dom.className = 'ak-editor-annotation';
		return { dom };
	}

	render(_props: Object, forwardRef: ForwardRef) {
		return (
			// all inline comment states are now set in decorations at ../pm-plugins/inline-comment.ts
			<span
				data-mark-type="annotation"
				data-id={this.node.attrs.id}
				data-mark-annotation-type={this.node.attrs.annotationType}
				ref={forwardRef}
			/>
		);
	}
}

export const getAnnotationViewClassname = (
	isUnresolved: boolean,
	hasFocus: boolean,
	isHovered: boolean,
): string | undefined => {
	if (!isUnresolved) {
		return;
	}
	if (hasFocus) {
		return AnnotationSharedClassNames.focus;
	}
	if (isHovered) {
		return AnnotationSharedClassNames.hover;
	}
	return AnnotationSharedClassNames.blur;
};

export const getBlockAnnotationViewClassname = (
	isUnresolved: boolean,
	hasFocus: boolean,
): string | undefined => {
	if (!isUnresolved) {
		return;
	}

	return hasFocus ? BlockAnnotationSharedClassNames.focus : BlockAnnotationSharedClassNames.blur;
};
