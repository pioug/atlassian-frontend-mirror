import type { Rule } from 'eslint';
import j from 'jscodeshift';

import * as ast from '../index';

describe('JSXElement', () => {
  describe('getName', () => {
    it('returns name of JSXElement', () => {
      const root = j(`<div></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.getName(node);
      expect(result).toBe('div');
    });
  });

  describe('updateName', () => {
    it('updates name of JSXElement', () => {
      const fixer = {
        replaceText: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes
      const root = j(`<div></div>`);
      const node = root.find(j.JSXElement).get().value;

      ast.JSXElement.updateName(node, 'Box', fixer);

      expect(fixer.replaceText).toHaveBeenCalledTimes(2);
    });

    it('updates name of self-closing JSXElement', () => {
      const fixer = {
        replaceText: jest.fn(),
      } as unknown as Rule.RuleFixer; // Aggressive typing only for testing purposes
      const root = j(`<div />`);
      const node = root.find(j.JSXElement).get().value;

      ast.JSXElement.updateName(node, 'Box', fixer);

      expect(fixer.replaceText).toHaveBeenCalledTimes(1);
    });
  });

  describe('containsSpreadAttributes', () => {
    it('returns true when JSXElement contains spread attributes ', () => {
      const root = j(`<div {...props}></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.containsSpreadAttributes(node);

      expect(result).toBe(true);
    });

    it("returns false when JSXElement doesn't contain spread attributes ", () => {
      const root = j(`<div></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.containsSpreadAttributes(node);

      expect(result).toBe(false);
    });
  });

  describe('getAttributeByName', () => {
    it('returns attribute if it exists', () => {
      const root = j(`<div css={myStyles}></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.getAttributeByName(node, 'css');

      expect(result).toBeTruthy();
    });

    it("returns undefined if attribute doesn't exist ", () => {
      const root = j(`<div></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.getAttributeByName(node, 'css');

      expect(result).toBeUndefined();
    });
  });

  describe('getAttributes', () => {
    it('returns correct number of attributes', () => {
      const root = j(`<div data-testid='some-test-id' css={myStyles}></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.getAttributes(node);

      expect(result).toHaveLength(2);
    });

    it('returns 0 if no attributes exist', () => {
      const root = j(`<div></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.getAttributes(node);

      expect(result).toHaveLength(0);
    });
  });
});
