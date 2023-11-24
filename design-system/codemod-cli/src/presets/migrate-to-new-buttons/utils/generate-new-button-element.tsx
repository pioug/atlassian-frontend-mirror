import type {
  API,
  JSXElement,
  JSXAttribute,
  JSXSpreadAttribute,
} from 'jscodeshift';

import { NEW_BUTTON_VARIANTS } from '../utils/constants';

const getIconAttribute = (
  attributes: (JSXAttribute | JSXSpreadAttribute)[],
) => {
  const iconAttr = attributes?.filter(
    (attribute) =>
      attribute.type === 'JSXAttribute' &&
      (attribute.name.name === 'iconBefore' ||
        attribute.name.name === 'iconAfter'),
  );

  if (attributes && iconAttr?.length && iconAttr[0].type === 'JSXAttribute') {
    return iconAttr[0];
  }

  return null;
};

export const moveSizeAndLabelAttributes = (
  element: JSXElement,
  j: API['jscodeshift'],
) => {
  const { attributes } = element.openingElement;

  const iconAttr = attributes && getIconAttribute(attributes);
  if (
    iconAttr &&
    iconAttr.value?.type === 'JSXExpressionContainer' &&
    iconAttr.value.expression.type === 'JSXElement'
  ) {
    const iconElement = iconAttr.value.expression;
    const iconJSXElementAttributes = iconElement.openingElement.attributes;
    if (Array.isArray(iconJSXElementAttributes)) {
      // move label and size attributes from icon to the root Button prop
      const labelAttribute = iconJSXElementAttributes.find(
        (attribute) =>
          attribute.type === 'JSXAttribute' && attribute.name.name === 'label',
      );
      if (labelAttribute && labelAttribute.type === 'JSXAttribute') {
        attributes?.push(labelAttribute);
      }

      const sizeAttribute = iconJSXElementAttributes.find(
        (attribute) =>
          attribute.type === 'JSXAttribute' && attribute.name.name === 'size',
      );
      if (sizeAttribute && sizeAttribute.type === 'JSXAttribute') {
        sizeAttribute.name.name = `UNSAFE_size`;
        attributes?.push(sizeAttribute);
      }
    }

    // replace JSXElement with identifier {<MoreIcon />} => {MoreIcon}
    if (iconElement.openingElement.name.type === 'JSXIdentifier') {
      iconAttr.value.expression = j.identifier(
        iconElement.openingElement.name.name,
      );
    }
  }
};

export const generateNewElement = (
  variant: (typeof NEW_BUTTON_VARIANTS)[keyof typeof NEW_BUTTON_VARIANTS]['as'],
  element: JSXElement,
  j: API['jscodeshift'],
) => {
  const { attributes } = element.openingElement;

  const iconAttr = attributes && getIconAttribute(attributes);
  if (variant === NEW_BUTTON_VARIANTS.icon.as && iconAttr && attributes) {
    moveSizeAndLabelAttributes(element, j);

    // rename iconBefore/iconAfter to icon
    iconAttr.name.name = 'icon';
  }

  // self closing if it's an icon button or icon link button
  const isSelfClosing =
    variant === NEW_BUTTON_VARIANTS.icon.as ||
    variant === NEW_BUTTON_VARIANTS.linkIcon.as;
  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(variant), attributes, isSelfClosing),
    isSelfClosing ? null : j.jsxClosingElement(j.jsxIdentifier(variant)),
    element.children,
  );
};
