/* eslint-disable @repo/internal/react/use-noop */
import type { Rule } from 'eslint';
import {
  isNodeOfType,
  PrivateIdentifier,
  Property,
} from 'eslint-codemod-utils';
import j from 'jscodeshift';

import * as ast from '../index';

describe('Object', () => {
  describe('hasProperty', () => {
    it('returns true when the property exists on the object', () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.hasProperty(node, 'padding');
      expect(result).toBe(true);
    });

    it("returns false when the property doesn't exist on the object", () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.hasProperty(node, 'margin');
      expect(result).toBe(false);
    });
  });

  describe('isFlat', () => {
    it('returns true when the object contains no nested values', () => {
      const root = j(
        "const styles = css({ padding: '8px', margin: 0, background: token('color.background')})",
      );
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.isFlat(node);
      expect(result).toBe(true);
    });

    it('returns false when the object contains nested values', () => {
      const root = j(`const styles = css({ ':after': { content: '""' } })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.isFlat(node);
      expect(result).toBe(false);
    });

    it('returns true when the object is empty', () => {
      const root = j(`const styles = css({})`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.isFlat(node);
      expect(result).toBe(true);
    });
  });

  describe('containsSpreadProps', () => {
    it('returns true when the object has spread props', () => {
      const root = j(`const styles = css({ padding: '8px', ...baseStyles })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.containsSpreadProps(node);
      expect(result).toBe(true);
    });

    it("returns false when the object doesn't have spread props", () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.containsSpreadProps(node);
      expect(result).toBe(false);
    });
  });

  describe('getEntryByPropertyName', () => {
    it('returns an entry when an entry with that property name exists', () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getEntryByPropertyName(node, 'padding');

      expect(result).not.toBeUndefined();
      // @ts-ignore
      expect(isNodeOfType(result, 'Property')).toBe(true);
    });

    it("returns undefined when an entry with that property name doesn't exist", () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getEntryByPropertyName(node, 'margin');

      expect(result).toBeUndefined();
    });
  });

  describe('getProperty', () => {
    it('returns the property when it exists on the object', () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getProperty(node, 'padding');

      expect(result).not.toBeUndefined();
      // @ts-ignore
      expect(isNodeOfType(result, 'Identifier')).toBe(true);
    });

    it("returns undefined when the property doesn't exist on the object", () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getProperty(node, 'margin');

      expect(result).toBeUndefined();
    });
  });

  describe('getEntries', () => {
    it('returns an array containing an element for each entry', () => {
      const root = j(`const styles = css({ padding: '8px', margin: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getEntries(node);

      expect(result.length).toBe(2);
      expect(((result[0] as Property).key as PrivateIdentifier).name).toBe(
        'padding',
      );
      expect(((result[1] as Property).key as PrivateIdentifier).name).toBe(
        'margin',
      );
    });

    it('returns an empty array for objects containing no properties', () => {
      const root = j(`const styles = css({})`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getEntries(node);

      expect(result.length).toBe(0);
    });
  });

  describe('getValueByPropertyName', () => {
    it('returns the value when the it exists on the object', () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getValueByPropertyName(node, 'padding');

      expect(result).not.toBeUndefined();
    });

    it("returns undefined when the property doesn't exist on the object", () => {
      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      const result = ast.Object.getProperty(node, 'margin');

      expect(result).toBeUndefined();
    });
  });

  describe('updateValue', () => {
    it('calls fixer.replaceText()', () => {
      const fixer = {
        replaceText: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      ast.Object.updateValue(node, 'padding', 'space.100', fixer);

      expect(fixer.replaceText).toHaveBeenCalledTimes(1);
    });
  });

  describe('appendEntry', () => {
    it('calls fixer.insertText()', () => {
      const fixer = {
        insertTextAfter: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      ast.Object.appendEntry(node, 'padding', 'space.100', fixer);

      expect(fixer.insertTextAfter).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteEntry', () => {
    it('calls fixer.remove()', () => {
      const fixer = {
        remove: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes

      const root = j(`const styles = css({ padding: '8px' })`);
      const node = root.find(j.ObjectExpression).get().value;

      ast.Object.deleteEntry(node, 'padding', fixer);

      expect(fixer.remove).toHaveBeenCalledTimes(1);
    });
  });
});
