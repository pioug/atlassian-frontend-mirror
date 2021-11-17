import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentBefore,
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

const comment = `
  The usage of the 'trigger', 'triggerType' and 'triggerButtonProps' prop in this component could not be transformed and requires manual intervention.
  Since version 11.0.0, we simplified the API and lean towards to only use 'trigger' prop.
  For more info please reach out to #help-design-system-code.
  `;

const convertTriggerType = (j: core.JSCodeshift, source: Collection<Node>) => {
  const defaultSpecifier = getDefaultSpecifier(
    j,
    source,
    '@atlaskit/dropdown-menu',
  );

  if (!defaultSpecifier) {
    return;
  }

  const elements = source.findJSXElements(defaultSpecifier);

  elements.forEach((element: ASTPath<JSXElement>) => {
    const triggerTypeProp = getJSXAttributesByName(j, element, 'triggerType');
    const triggerProp = getJSXAttributesByName(j, element, 'trigger');

    // just skip when triggerType or trigger is not defined
    if (triggerTypeProp.length === 0 || triggerProp.length === 0) {
      return;
    }

    const triggerButtonPropsProp = getJSXAttributesByName(
      j,
      element,
      'triggerButtonProps',
    );
    const type = triggerProp.get().value.value.type;

    // we're safe to do the conversion for string only trigger
    if (type === 'StringLiteral' && triggerButtonPropsProp.length === 0) {
      triggerTypeProp.forEach((attribute: any) => {
        j(attribute).remove();
      });
    } else {
      // for anything else we left a inline message
      addCommentBefore(j, elements, comment);
    }
  });
};

export default convertTriggerType;
