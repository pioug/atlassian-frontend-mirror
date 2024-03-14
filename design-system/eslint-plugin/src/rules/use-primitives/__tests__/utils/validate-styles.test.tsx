import j from 'jscodeshift';

import { RuleConfig } from '../../config';
import { validateStyles } from '../../utils/validate-styles';

const defaultConfig: RuleConfig = {
  patterns: ['compiled-css-function'],
};

describe('validateStyles', () => {
  it('accepts a valid styled component with literal values', () => {
    const root = j(`const MyContainer = styled.div({ padding: '8px' })`);

    const result = validateStyles(
      root.find(j.CallExpression).get().value,
      defaultConfig,
    );

    expect(result).toBe(true);
  });

  it('accepts an empty styled component', () => {
    const root = j(`const MyContainer = styled.div({})`);

    const result = validateStyles(
      root.find(j.CallExpression).get().value,
      defaultConfig,
    );

    expect(result).toBe(false);
  });

  it('accepts a styled component with multiple properties', () => {
    const root = j(`
    const MyContainer = styled.div({
      padding: '8px',
      margin: '8px',
    })
    `);

    const result = validateStyles(root.find(j.CallExpression).get().value, {
      patterns: ['compiled-styled-object', 'multiple-properties'],
    });

    expect(result).toBe(true);
  });

  it('rejects a styled component with spread', () => {
    const root = j(`
    const MyContainer = styled.div({
      padding: '8px',
      ...moreStyles,
    })
    `);

    const result = validateStyles(
      root.find(j.CallExpression).get().value,
      defaultConfig,
    );

    expect(result).toBe(false);
  });

  it('rejects a numerical value', () => {
    const root = j(`const MyContainer = styled.div({ padding: 8 })`);

    const result = validateStyles(
      root.find(j.CallExpression).get().value,
      defaultConfig,
    );

    expect(result).toBe(false);
  });

  it('rejects a styled component with properties we do not support yet', () => {
    const root = j(`const MyContainer = styled.div({ display: 'flex' })`);

    const result = validateStyles(
      root.find(j.CallExpression).get().value,
      defaultConfig,
    );

    expect(result).toBe(false);
  });

  describe('with token config enabled', () => {
    const baseConfig = Object.assign({}, defaultConfig, {
      patterns: defaultConfig.patterns.concat('css-property-with-tokens'),
    });
    it('accepts a valid styled component with a single tokenised value + fallback', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100', '8px') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        baseConfig,
      );

      expect(result).toBe(true);
    });

    it('accepts a valid styled component with a single tokenised value without fallback', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        baseConfig,
      );

      expect(result).toBe(true);
    });

    it('rejects if token default value will not match implicit xcss default', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100', '9px') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        baseConfig,
      );

      expect(result).toBe(false);
    });
  });

  describe('with token config disabled', () => {
    it('accepts a valid styled component with a single tokenised value + fallback', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100', '8px') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        defaultConfig,
      );

      expect(result).toBe(false);
    });

    it('accepts a valid styled component with a single tokenised value without fallback', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        defaultConfig,
      );

      expect(result).toBe(false);
    });

    it('rejects if token default value will not match implicit xcss default', () => {
      const root = j(
        `const MyContainer = styled.div({ padding: token('space.100', '9px') })`,
      );

      const result = validateStyles(
        root.find(j.CallExpression).get().value,
        defaultConfig,
      );

      expect(result).toBe(false);
    });
  });
});
