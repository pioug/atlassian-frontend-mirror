import { API, JSXElement, JSXAttribute, JSXSpreadAttribute } from 'jscodeshift';
import { addCommentBefore } from '@atlaskit/codemod-utils';

import {
  NEW_BUTTON_VARIANTS,
  iconPropsNoLongerSupportedComment,
} from '../utils/constants';

export const getIconAttributes = (
  attributes: (JSXAttribute | JSXSpreadAttribute)[],
): JSXAttribute[] | null => {
  const iconAttr = attributes?.filter(
    (attribute) =>
      attribute.type === 'JSXAttribute' &&
      (attribute.name.name === 'iconBefore' ||
        attribute.name.name === 'iconAfter'),
  );

  if (iconAttr?.length) {
    return iconAttr as JSXAttribute[];
  }

  return null;
};

export const getIconElement = (iconAttr: JSXAttribute) => {
  if (
    iconAttr &&
    iconAttr.value?.type === 'JSXExpressionContainer' &&
    iconAttr.value.expression.type === 'JSXElement'
  ) {
    return iconAttr.value.expression;
  }
  return null;
};

export const moveSizeAndLabelAttributes = (
  element: JSXElement,
  j: API['jscodeshift'],
  iconRenamed: boolean = false,
) => {
  const { attributes } = element.openingElement;

  const iconAttrs = attributes && getIconAttributes(attributes);
  iconAttrs?.forEach((iconAttr) => {
    const iconElement = getIconElement(iconAttr);
    if (!iconElement) {
      return;
    }
    const iconJSXElementAttributes = iconElement.openingElement.attributes;
    // add inlined comment to the icon if it has any attributes other than label and size
    if (Array.isArray(iconJSXElementAttributes)) {
      const ifIconAttributeEitherLabelOrSize = iconJSXElementAttributes?.every(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          typeof attribute.name.name === 'string' &&
          (attribute.name.name === 'size' || attribute.name.name === 'label'),
      );
      if (!ifIconAttributeEitherLabelOrSize) {
        addCommentBefore(
          j,
          j(iconAttr),
          iconPropsNoLongerSupportedComment,
          'line',
        );
      }

      // move label and size attributes from icon to the root Button prop
      const labelAttribute = iconJSXElementAttributes.find(
        (attribute) =>
          attribute.type === 'JSXAttribute' && attribute.name.name === 'label',
      );

      if (
        labelAttribute &&
        labelAttribute.type === 'JSXAttribute' &&
        iconRenamed
      ) {
        attributes?.push(labelAttribute);
      }

      const sizeAttribute = iconJSXElementAttributes.find(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          attribute.name.name === 'size' &&
          attribute.value?.type === 'StringLiteral' &&
          attribute.value?.value !== 'medium',
      );
      if (sizeAttribute && sizeAttribute.type === 'JSXAttribute') {
        sizeAttribute.name.name = iconRenamed
          ? 'UNSAFE_size'
          : `UNSAFE_${iconAttr.name.name}_size`;
        attributes?.push(sizeAttribute);
      }
    }

    // replace JSXElement with identifier {<MoreIcon />} => {MoreIcon}
    if (
      iconElement.openingElement.name.type === 'JSXIdentifier' &&
      iconAttr.value?.type === 'JSXExpressionContainer'
    ) {
      iconAttr.value.expression = j.identifier(
        iconElement.openingElement.name.name,
      );
    }
  });
};

export const generateNewElement = (
  variant: (typeof NEW_BUTTON_VARIANTS)[keyof typeof NEW_BUTTON_VARIANTS],
  element: JSXElement,
  j: API['jscodeshift'],
) => {
  const { attributes } = element.openingElement;

  const iconAttrs = attributes && getIconAttributes(attributes);
  const isIconOrLinkIcon =
    variant === NEW_BUTTON_VARIANTS.icon ||
    variant === NEW_BUTTON_VARIANTS.linkIcon;

  if (isIconOrLinkIcon && iconAttrs?.length) {
    moveSizeAndLabelAttributes(element, j, true);

    // rename iconBefore/iconAfter to icon
    iconAttrs[0].name.name = 'icon';

    const ariaLabelAttr = j(element.openingElement)
      .find(j.JSXAttribute)
      .filter((attribute) => attribute.node.name.name === 'aria-label');
    if (ariaLabelAttr.length) {
      const hasNoLabelProp = !attributes?.find(
        (attribute) =>
          attribute.type === 'JSXAttribute' && attribute.name.name === 'label',
      );
      if (hasNoLabelProp && attributes) {
        attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier('label'),
            ariaLabelAttr.get().node.value,
          ),
        );
      }
      ariaLabelAttr.remove();
    }
  }

  return j.jsxElement(
    // self closing if it's an icon button or icon link button
    j.jsxOpeningElement(j.jsxIdentifier(variant), attributes, isIconOrLinkIcon),
    isIconOrLinkIcon ? null : j.jsxClosingElement(j.jsxIdentifier(variant)),
    element.children,
  );
};
