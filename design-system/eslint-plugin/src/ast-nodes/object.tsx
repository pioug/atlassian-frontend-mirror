/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
  identifier,
  isNodeOfType,
  literal,
  ObjectExpression,
  property,
  Property,
  SpreadElement,
} from 'eslint-codemod-utils';

const ASTObjectExpression = {
  /**
   * Returns `true` if an object contains a property with the specified name, `false` otherwise.
   */
  hasProperty(node: ObjectExpression, name: string): boolean {
    return !!ASTObjectExpression.getProperty(node, name);
  },

  /**
   * Returns true if an object contains no nested values, false otherwise.
   *
   * Note:
   *  - Returns false if object contains spread elements.
   *  - Returns true if object is empty.
   */
  isFlat(node: ObjectExpression): boolean {
    return node.properties.every((entry: Property | SpreadElement) => {
      if (!isNodeOfType(entry, 'Property')) {
        return false;
      }

      if (isNodeOfType(entry.value, 'ObjectExpression')) {
        return false;
      }

      return true;
    });
  },

  /**
   * Returns the first Property node from an Object that matches the provided name.
   */
  getEntryByPropertyName(
    node: ObjectExpression,
    name: string,
  ): Property | undefined {
    return node.properties.find(
      (property: Property | SpreadElement): property is Property => {
        if (!isNodeOfType(property, 'Property')) {
          return false;
        }

        if (!isNodeOfType(property.key, 'Identifier')) {
          return false;
        }

        return property.key.name === name;
      },
    );
  },

  deleteEntry(
    node: ObjectExpression,
    name: string,
    fixer: Rule.RuleFixer,
  ): Rule.Fix[] {
    const entry = ASTObjectExpression.getEntryByPropertyName(node, name);
    if (!entry) {
      return [];
    }

    return [fixer.remove(entry)];
  },

  /**
   * Returns only the property @type {Property['key']} like: `padding` from: `{ padding: '8px' }`.
   * If you want the key/value pair, use `getEntryByPropertyName`.
   */
  getProperty(
    node: ObjectExpression,
    name: string,
  ): Property['key'] | undefined {
    return ASTObjectExpression.getEntryByPropertyName(node, name)?.key;
  },

  /**
   * Gets the array of key/value pairs in an ObjectExpression.
   */
  getEntries(node: ObjectExpression): (Property | SpreadElement)[] {
    return node.properties;
  },

  /**
   * Returns a only the property @type {Property['value']} like: `'8px` from: `{ padding: '8px' }`.
   *
   * Values can be basically anything, so be careful with this.
   */
  getValueByPropertyName(
    node: ObjectExpression,
    name: string,
  ): Property['value'] | undefined {
    return ASTObjectExpression.getEntryByPropertyName(node, name)?.value;
  },

  containsSpreadProps(node: ObjectExpression): boolean {
    return node.properties.some((property: Property | SpreadElement) => {
      return isNodeOfType(property, 'SpreadElement');
    });
  },

  updateValue(
    node: ObjectExpression,
    propertyName: string,
    newValue: string,
    fixer: Rule.RuleFixer,
  ): Rule.Fix {
    const value = ASTObjectExpression.getValueByPropertyName(
      node,
      propertyName,
    );

    if (value === undefined) {
      throw new Error(
        `Object.updateValue: Could not get value of property ${propertyName}`,
      );
    }
    return fixer.replaceText(value, newValue);
  },

  /**
   * Appends a key-value pair to the end of an object. For example:
   * ```
   * ast.Object.appendEntry(
   *   node, // { padding: 'space.100' }
   *   key, // 'margin',
   *   value, // 'space.200'
   *   fixer,
   * )
   * ```
   * Will result in `{ padding: 'space.100', margin: 'space.200'}`.
   */
  appendEntry(
    node: ObjectExpression,
    key: string,
    value: string,
    fixer: Rule.RuleFixer,
  ): Rule.Fix {
    return fixer.insertTextAfter(
      node.properties[node.properties.length - 1],
      `${property({
        key: identifier(key),
        value: literal(value),
      }).toString()}, `,
    );
  },
};

export { ASTObjectExpression as Object };
