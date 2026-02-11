import type { API, Collection, JSXElement } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

import { overlayPropComment } from './constants';

export const addCommentForOverlayProp: (oldButtons: Collection<JSXElement>, j: API["jscodeshift"]) => void = (
	oldButtons: Collection<JSXElement>,
	j: API['jscodeshift'],
) => {
	oldButtons
		.find(j.JSXAttribute)
		.filter((attribute) => attribute.node.name.name === 'overlay')
		.forEach((attribute) => {
			addCommentBefore(j, j(attribute), overlayPropComment, 'block');
		});
};
