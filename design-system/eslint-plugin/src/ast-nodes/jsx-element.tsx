import type { Rule } from 'eslint';
import {
  isNodeOfType,
  JSXAttribute,
  JSXElement,
  jsxIdentifier,
  JSXSpreadAttribute,
} from 'eslint-codemod-utils';

export const JSXElementHelper = {
  /**
   * Names of JSXElements can be any of:
   * `<Component></Component>` - (JSXIdentifier)
   * `<MyComponents.Component></MyComponents.Component>` - `MyComponents` is a namespace (JSXNamespacedName)
   * `<MyComponents.Component></MyComponents.Component>` - `MyComponents` is an object (JSXMemberExpression)
   *
   * Getting the name of a JSXMemberExpression is difficult, because object can contain objects, which is recursively defined in the AST.
   * e.g. getting the name of `<MyComponents.PresentationLayer.LeftSideBar.Header />` would require `getName` to recursively resolve all parts of the name.
   * `getName` does not currently have this functionality. Add it if you need it.
   */
  getName(node: JSXElement): string {
    if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
      // TODO: We may want to log this
      return '';
    }

    return node.openingElement.name.name;
  },

  updateName(
    node: JSXElement,
    newName: string,
    fixer: Rule.RuleFixer,
  ): Rule.Fix[] {
    const isSelfClosing = JSXElementHelper.isSelfClosing(node);
    const openingElementFix = fixer.replaceText(
      node.openingElement.name,
      jsxIdentifier(newName).toString(),
    );

    if (isSelfClosing || !node.closingElement) {
      return [openingElementFix];
    }

    const closingElementFix = fixer.replaceText(
      node.closingElement.name,
      jsxIdentifier(newName).toString(),
    );

    return [openingElementFix, closingElementFix];
  },

  isSelfClosing(node: JSXElement) {
    return node.openingElement.selfClosing;
  },

  getAttributes(node: JSXElement): (JSXAttribute | JSXSpreadAttribute)[] {
    return node.openingElement.attributes;
  },

  getAttributeByName(node: JSXElement, name: string): JSXAttribute | undefined {
    return node.openingElement.attributes.find(
      (attr: JSXAttribute | JSXSpreadAttribute): attr is JSXAttribute => {
        // Ignore anything other than JSXAttribute
        if (!isNodeOfType(attr, 'JSXAttribute')) {
          return false;
        }

        return attr.name.name === name;
      },
    );
  },

  containsSpreadAttributes(node: JSXElement): boolean {
    return node.openingElement.attributes.some(
      (attr: JSXAttribute | JSXSpreadAttribute) => {
        return isNodeOfType(attr, 'JSXSpreadAttribute');
      },
    );
  },
};

export { JSXElementHelper as JSXElement };
