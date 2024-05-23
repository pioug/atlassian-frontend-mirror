import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';
import j from 'jscodeshift';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

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

  describe('hasAllowedAttrsOnly', () => {
    it('returns true if no unallowed attributes exist', () => {
      const root = j(`<div data-testid='some-test-id' css={myStyles}></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.hasAllowedAttrsOnly(node, [
        'key',
        'id',
        'data-testid',
        'css',
      ]);

      expect(result).toBe(true);
    });

    it('returns false if unallowed attributes exist', () => {
      const root = j(`<div data-test-id='some-test-id' css={myStyles}></div>`);
      const node = root.find(j.JSXElement).get().value;

      const result = ast.JSXElement.hasAllowedAttrsOnly(node, [
        'key',
        'id',
        'data-testid',
        'css',
      ]);

      expect(result).toBe(false);
    });
  });

  const updateNameRuleTester = createJSXElementRuleFixTester(
    'updateName',
    (node, fixer) => {
      return ast.JSXElement.updateName(node, 'Box', fixer);
    },
  );

  updateNameRuleTester.run([
    {
      code: '<div></div>',
      output: '<Box></Box>',
    },
    {
      code: '<div />',
      output: '<Box />',
    },
  ]);

  const addAttributeRuleTester = createJSXElementRuleFixTester(
    'addAttribute',
    (node, fixer) => {
      return ast.JSXElement.addAttribute(node, 'test', 'myValue', fixer);
    },
  );
  addAttributeRuleTester.run([
    {
      code: '<div></div>',
      output: "<div test='myValue'></div>",
    },
    {
      code: '<div />',
      output: "<div test='myValue' />",
    },
    {
      code: "<div data-testid='some-test-id'></div>",
      output: "<div data-testid='some-test-id' test='myValue'></div>",
    },
    {
      code: "<div data-testid='some-test-id' />",
      output: "<div data-testid='some-test-id' test='myValue' />",
    },
  ]);
});

type RuleFixer = (
  node: JSXElement,
  fixer: Rule.RuleFixer,
) => Rule.Fix | Rule.Fix[];

type TestCase = {
  code: string;
  output: string;
};

function createJSXElementRuleFixTester(name: string, createFixer: RuleFixer) {
  const rule = {
    meta: {
      fixable: 'code',
      messages: {
        [name]: 'Test message',
      },
    },
    create(context: Rule.RuleContext): Rule.RuleListener {
      return {
        JSXElement: (node: Rule.Node) => {
          if (!isNodeOfType(node, 'JSXElement')) {
            return;
          }
          context.report({
            node: node.openingElement,
            messageId: name,
            fix: (fixer: Rule.RuleFixer) => {
              return createFixer(node, fixer);
            },
          });
        },
      };
    },
  };

  function run(testCases: TestCase[]) {
    ruleTester.run(name, rule, {
      valid: [],
      invalid: testCases.map((testCase) => ({
        ...testCase,
        errors: [
          {
            messageId: name,
          },
        ],
      })),
    });
  }

  return { run };
}
