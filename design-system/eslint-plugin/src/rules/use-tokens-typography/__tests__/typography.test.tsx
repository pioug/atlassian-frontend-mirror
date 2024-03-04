import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

import type { Tests } from './_types';

export const typographyTests: Tests = {
  valid: [
    // Unrelated
    {
      code: `const styles = css({
        overflow: auto
      })`,
    },
    // Already a token
    {
      code: `const styles = css({
        font: token('font.heading.xsmall', 'something')
      })`,
    },
    // lineHeight only
    {
      code: `
        const styles = css({
          lineHeight: '28px',
        })`,
    },
    // fontWeight only
    {
      code: `
        const styles = css({
          fontWeight: 400,
        })`,
    },
    // already a token + fontStyle italic
    {
      code: `
        const styles = css({
          fontSize: token('font.body.large'),
          fontStyle: 'italic'
        })`,
    },
  ],
  invalid: [
    // NO FIXES

    // No token match for fontSize + lineHeight
    {
      code: `
        const styles = css({
          fontWeight: '400',
          fontSize: '12px',
          lineHeight: '12px',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // No token match
    {
      code: `
        const styles = css({
          fontSize: '12px',
          lineHeight: '20px',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // No token match
    {
      code: `
        const styles = css({
          fontSize: '12px',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // No token match: lineHeight 1
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '14px',
          lineHeight: 1,
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // No token match: lineHeight 1 (in px)
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontWeight: '400',
          fontSize: '11px',
          lineHeight: '11px',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },

    // FIXES
    // fontSize and fontWeight - 1 token match
    {
      code: `
        const styles = css({
          fontSize: '14px',
          fontWeight: 600,
          padding: '8px'
        })`,
      output: `import { token } from '@atlaskit/tokens'\n
        const styles = css({
          font: token('font.heading.xsmall', 'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
          padding: '8px'
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // fontSize only - 1 token match - same fontWeight
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          padding: '8px',
          fontSize: '16px',
          color: 'red'
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          padding: '8px',
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
          color: 'red'
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // fontSize and lineHeight - 1 token match
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '16px',
          padding: '8px',
          lineHeight: '24px',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
          padding: '8px',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // fontSize match, fontWeight conversion
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '14px',
          fontWeight: 500
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body', 'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontWeight: token('font.weight.medium', '500'),
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // fontSize only - number - 1 token match
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          padding: '8px',
          fontSize: 16,
          color: 'red'
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          padding: '8px',
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
          color: 'red'
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },

    // fontSize match, fontWeight conversion
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontWeight: '600',
          fontSize: '11px',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.small', 'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontWeight: token('font.weight.semibold', '600'),
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // nested object, fontSize match, fontWeight conversion
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '14px',
          fontWeight: 500,
          ':hover': {
            fontSize: '14px',
            fontWeight: 500,
          }
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body', 'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontWeight: token('font.weight.medium', '500'),
          ':hover': {
            font: token('font.body', 'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontWeight: token('font.weight.medium', '500'),
          }
        })`,
      errors: [
        { messageId: 'noRawTypographyValues' },
        { messageId: 'noRawTypographyValues' },
      ],
    },
    // Font family uses Charlie Display
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '16px',
          fontFamily: "Charlie Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontFamily: token('font.family.brand.heading', '"Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // Font family uses Charlie Text
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '16px',
          fontFamily: "Charlie Text, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontFamily: token('font.family.brand.body', '"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // Font family uses Charlie Text variable
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontFamily: CharlieTextVariable,
          fontSize: '16px',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontFamily: CharlieTextVariable,
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // Font style normal
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '16px',
          fontStyle: 'normal',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // Font style italic
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontStyle: 'italic',
          fontSize: '16px',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontStyle: 'italic',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // Font weight, Font family uses Charlie Text, font style italic, letterSpacing
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'Charlie Text',
          fontStyle: 'italic',
          letterSpacing: '-0.008em',
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body.large', 'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontWeight: token('font.weight.medium', '500'),
fontFamily: token('font.family.brand.body', '"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
fontStyle: 'italic',
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // styled.div - fontSize and fontWeight - 1 token match
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = styled.div({
          fontSize: '14px',
          fontWeight: 600,
          padding: '8px'
        })`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = styled.div({
          font: token('font.heading.xsmall', 'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
          padding: '8px'
        })`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // unary expression with fontSizeSmall
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const someValue = fontSizeSmall();
        const styles = css({
          fontSize: someValue,
        });`,
      output: `
        import { token } from '@atlaskit/tokens';
        const someValue = fontSizeSmall();
        const styles = css({
          font: token('font.body.small', 'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
        });`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
    // unary expression with fontSize
    {
      code: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          fontSize: fontSize(),
        });`,
      output: `
        import { token } from '@atlaskit/tokens';
        const styles = css({
          font: token('font.body', 'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif'),
        });`,
      errors: [{ messageId: 'noRawTypographyValues' }],
    },
  ],
};

typescriptEslintTester.run(
  'use-tokens-typography',
  // @ts-expect-error
  rule,
  typographyTests,
);
tester.run('use-tokens-typography', rule, typographyTests);
