import { transformSync } from '@babel/core';

import babelPlugin from '../plugin';

// Mock tokens exports to keep values stable
jest.mock('../../artifacts/token-names', () => {
  return {
    __esModule: true,
    default: {
      'test-token': '--test-token',
      'test-token-escape': '--test-token \\u{54} ${ ` \' " \u{54}',
    },
  };
});
jest.mock('../../artifacts/token-default-values', () => ({
  __esModule: true,
  default: {
    'test-token': '#ffffff',
    'test-token-escape': '#000000',
  },
}));

const transform = (
  shouldUseAutoFallback = false,
  transformTemplateLiterals = false,
) => (code: TemplateStringsArray | string): string => {
  const plugins: any = [
    [
      babelPlugin,
      {
        shouldUseAutoFallback: shouldUseAutoFallback,
      },
    ],
  ];
  if (transformTemplateLiterals) {
    plugins.push('@babel/plugin-transform-template-literals');
  }

  const result = transformSync(typeof code === 'string' ? code : code[0], {
    configFile: false,
    babelrc: false,
    plugins: plugins,
  });

  if (!result?.code) {
    throw new Error();
  }

  return result.code;
};

describe('Tokens Babel Plugin', () => {
  it('converts 1-argument usage correctly when shouldUseAutoFallback set to false', () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token');
    `;

    expect(actual).toMatchInlineSnapshot('"\\"var(--test-token)\\";"');
  });

  it('converts 1-argument usage correctly when shouldUseAutoFallback set to true', () => {
    const actual = transform(true)`
      import { token } from '@atlaskit/tokens';
      token('test-token');
    `;

    expect(actual).toMatchInlineSnapshot('"\\"var(--test-token, #ffffff)\\";"');
  });

  it('converts StringLiteral second argument', () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token', 'blue');
    `;

    expect(actual).toMatchInlineSnapshot('"\\"var(--test-token, blue)\\";"');
  });

  it('removes empty StringLiteral second argument', () => {
    const noAutoFallback = transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token', '');
    `;

    // No fallback inserted if user passes in an empty string
    const autoFallback = transform(true)`
      import { token } from '@atlaskit/tokens';
      token('test-token', '');
    `;

    expect(noAutoFallback).toMatchInlineSnapshot('"\\"var(--test-token)\\";"');
    expect(autoFallback).toMatchInlineSnapshot('"\\"var(--test-token)\\";"');
  });

  it('handles aliased imports', () => {
    const actual = transform()`
      import { token as getToken } from '@atlaskit/tokens';
      getToken('test-token');
    `;

    expect(actual).toMatchInlineSnapshot('"\\"var(--test-token)\\";"');
  });

  it("does nothing if there's no import of @atlaskit/tokens", () => {
    const actual = transform()("token('test-token', color.blue);");

    expect(actual).toMatchInlineSnapshot(
      '"token(\'test-token\', color.blue);"',
    );
  });

  it("doesn't remove tokens import if there are still usages left", () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      a = token;
      token('test-token', 'blue');
    `;

    expect(actual).toMatchInlineSnapshot(`
          "import { token } from '@atlaskit/tokens';
          a = token;
          \\"var(--test-token, blue)\\";"
        `);
  });

  it('converts expression second arguments', () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token', \`\${color.blue}\`);
      token('test-token', color.blue);
      token('test-token', condition ? "blue" : color.red );
      token('test-token', getColor());
    `;

    expect(actual).toMatchInlineSnapshot(`
      "\`var(--test-token, \${\`\${color.blue}\`})\`;
      \`var(--test-token, \${color.blue})\`;
      \`var(--test-token, \${condition ? \\"blue\\" : color.red})\`;
      \`var(--test-token, \${getColor()})\`;"
    `);
  });

  it('converts escape characters correctly', () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token-escape', color.blue);
      token('test-token-escape');
    `;

    expect(actual).toMatchInlineSnapshot(`
      "\`var(--test-token \\\\\\\\u{54} \\\\\${ \\\\\` ' \\" T, \${color.blue})\`;
      \\"var(--test-token \\\\\\\\u{54} \${ \` ' \\\\\\" T)\\";"
    `);
  });

  // If the token name has escape characters they should make it into the final result
  it('works correctly with template literal conversion', () => {
    const actual = transform(false, true)`
      import { token } from '@atlaskit/tokens';
      token('test-token', \`\${color.blue}\`);
      token('test-token', color.blue);
      token('test-token', condition ? "blue" : color.red );
      token('test-token', getColor());
      token('test-token-escape', color.blue);
      token('test-token-escape');
    `;

    expect(actual).toMatchInlineSnapshot(`
      "\\"var(--test-token, \\".concat(\\"\\".concat(color.blue), \\")\\");
      \\"var(--test-token, \\".concat(color.blue, \\")\\");
      \\"var(--test-token, \\".concat(condition ? \\"blue\\" : color.red, \\")\\");
      \\"var(--test-token, \\".concat(getColor(), \\")\\");
      \\"var(--test-token \\\\\\\\u{54} \${ \` ' \\\\\\" T, \\".concat(color.blue, \\")\\");
      \\"var(--test-token \\\\\\\\u{54} \${ \` ' \\\\\\" T)\\";"
    `);
  });

  it('throws if token does not exist', () => {
    expect(
      () => transform()`
      import { token } from '@atlaskit/tokens';
      token('this.token.does.not.exist');
    `,
    ).toThrowError("token 'this.token.does.not.exist' does not exist");
  });

  it('throws on empty token() call', () => {
    expect(
      () => transform()`
      import { token } from '@atlaskit/tokens';
      token();
    `,
    ).toThrowError('token() requires at least one argument');
  });

  it('throws on non-string token argument', () => {
    expect(
      () => transform()`
      import { token } from '@atlaskit/tokens';
      token(()=>{}, color.blue, color.red);
    `,
    ).toThrowError('token() must have a string as the first argument');
  });

  it('throws on too many arguments', () => {
    expect(
      () => transform()`
      import { token } from '@atlaskit/tokens';
      token('test-token', color.blue, color.red);
    `,
    ).toThrowError('token() does not accept 3 arguments');
  });

  it('correctly handles assorted usages', () => {
    const actual = transform()`
      import { token } from '@atlaskit/tokens';
      componentStyles = css({
        color: token('test-token'),
        color: \`\${token('test-token')}\`,
      });
    `;

    expect(actual).toMatchInlineSnapshot(`
      "componentStyles = css({
        color: \\"var(--test-token)\\",
        color: \`\${\\"var(--test-token)\\"}\`
      });"
    `);
  });

  it('correctly handles nested scopes', () => {
    const actual = transform()`
import { token } from '@atlaskit/tokens';
const getStyles = css => css\`
  \${true && \`color: \${token('test-token')}\`}
\`;
    `;

    expect(actual).toMatchInlineSnapshot(`
          "const getStyles = css => css\`
            \${true && \`color: \${\\"var(--test-token)\\"}\`}
          \`;"
      `);
  });
});
