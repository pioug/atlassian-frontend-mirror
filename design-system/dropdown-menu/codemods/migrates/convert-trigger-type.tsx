import type { ASTPath, default as core, JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import {
	addCommentBefore,
	getDefaultSpecifier,
	getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

const comment = `
  The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
  Since version 11.0.0, we have simplified the API and now only use the 'trigger' prop.
  Please refer to https://hello.atlassian.net/wiki/spaces/DST/pages/1330997516/Dropdown+menu+upgrade+guide for more details.
  And feel free to reach out to us on our support channel if you have more queries – #help-design-system.
  `;

const convertTriggerType = (j: core.JSCodeshift, source: Collection<Node>) => {
	const defaultSpecifier = getDefaultSpecifier(j, source, '@atlaskit/dropdown-menu');

	if (!defaultSpecifier) {
		return;
	}

	const elements = source.findJSXElements(defaultSpecifier);

	elements.forEach((element: ASTPath<JSXElement>) => {
		const triggerTypeProp = getJSXAttributesByName(j, element, 'triggerType');
		const triggerProp = getJSXAttributesByName(j, element, 'trigger');

		// just skip when trigger is not defined
		if (triggerProp.length === 0) {
			return;
		}

		const triggerButtonPropsProp = getJSXAttributesByName(j, element, 'triggerButtonProps');
		const type = triggerProp.get().value.value.type;

		// we're safe to do the conversion for string only trigger
		if (type === 'StringLiteral' && triggerButtonPropsProp.length === 0) {
			triggerTypeProp.forEach((attribute: any) => {
				j(attribute).remove();
			});
		} else {
			// for anything else we left a inline message
			// Overriding the comment prefix to be 'TODO: (from codemod)'
			// to avoid trailing spaces.
			addCommentBefore(j, triggerProp, comment, 'block', 'TODO: (from codemod)');
		}
	});
};

export default convertTriggerType;
