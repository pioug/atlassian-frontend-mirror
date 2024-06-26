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

	render(_props: {}, forwardRef: ForwardRef) {
		return (
			// all inline comment states are now set in decorations at ../pm-plugins/inline-comment.ts
			<span data-mark-type="annotation" ref={forwardRef} />
		);
	}
}

export const getAnnotationViewClassname = (
	isUnresolved: boolean,
	hasFocus: boolean,
): string | undefined => {
	if (!isUnresolved) {
		return;
	}

	return hasFocus ? AnnotationSharedClassNames.focus : AnnotationSharedClassNames.blur;
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
