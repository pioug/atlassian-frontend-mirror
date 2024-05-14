import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-imported-style-values',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'Basic valid test for css',
        code: `
          import { css } from '@compiled/react';
          const sharedObject = { padding: 0 };
          const styles = css({
            ...sharedObject,
            color: 'red',
          });
        `,
      },
      {
        name: 'Valid emotion css call',
        code: `
          import { css } from '@emotion/react';
          import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';
          const styles = css({
            backgroundColor: token('elevation.surface.overlay', N0),
            borderRadius: token('border.radius', '3px'),
            [CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
          });
        `,
      },
      {
        name: 'Valid styled component',
        code: `
          import { styled } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const Component = styled.div({
            borderRadius: token('border.radius', '3px')
          })
        `,
      },
      {
        name: 'Variables defined in same file',
        code: `
          import { css } from '@compiled/react';
          const color = 'red',
          const containerWidth = 0;
          const styles = css({
            color,
            width: containerWidth
          });
        `,
      },
      {
        name: 'Importing token function',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = css({
            padding: token('space.150'),
          });
        `,
      },
      {
        name: 'Valid cssMap call',
        code: `
          import { cssMap } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = cssMap({
            root: {
              width: '16rem',
            },
            blackBorder: {
              border: '1px solid black',
              borderRadius: token('border.radius.100', '3px'),
            },
          });
        `,
      },
      {
        name: 'Custom import sources (subtractive)',
        code: `
          import { css } from '@compiled/react';
          import { color } from '../shared'
          const styles = css({
            color
          });
        `,
        options: [
          {
            importSources: [],
          },
        ],
      },
      {
        name: 'Custom allowed function',
        code: `
          import { css } from '@compiled/react';
          import { getColor } from 'my-package'
          const styles = css({
            color: getColor()
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['my-package', 'getColor']],
          },
        ],
      },
      {
        name: 'Custom allowed dynamic key',
        code: `
          import { css } from '@compiled/react';
          import { colorKey } from 'my-package';
          const styles = css({
            [colorKey]: 'red',
          });
        `,
        options: [
          {
            allowedDynamicKeys: [['my-package', 'colorKey']],
          },
        ],
      },
    ],
    invalid: [
      {
        name: 'Importing spreadElement',
        code: `
          import { css } from '@compiled/react';
          import { importedStyles } from '../shared';
          const styles = css({
            ...importedStyles,
            color: 'red',
          });
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
      {
        name: 'Importing functions to use within css',
        code: `
          import { css } from '@compiled/react';
          import { getColor } from '@mui/theme';
          import { colorKey } from '../shared';
          const styles = css({
            [colorKey]: getColor('red'),
          });
        `,
        errors: [
          { messageId: 'no-imported-style-values' },
          { messageId: 'no-imported-style-values' },
        ],
      },
      {
        name: 'Importing objects to use within css',
        code: `
          import { css } from '@compiled/react';
          import { colors } from '@mui/theme';
          const styles = css({
            background: colors['red'],
          });
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
      {
        name: 'Importing variables to use within template literal',
        code: `
          import { css } from '@compiled/react';
          import { HEIGHT } from '../shared';
          const styles = css({
            height: \`\${HEIGHT}px\`,
          });
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
      {
        name: 'Importing variables to within conditional expression',
        code: `
          import { css } from '@compiled/react';
          import { ff } from '@atlaskit/ff';
          import { HEIGHT } from '../shared';
          const styles = css({
            width: ff('…') ? \`\${HEIGHT}px\` : undefined,
          });
        `,
        errors: [
          { messageId: 'no-imported-style-values' },
          { messageId: 'no-imported-style-values' },
        ],
      },
      {
        name: 'Invalid styled component',
        code: `
          import { styled } from '@compiled/react';
          import { HEIGHT, importedStyles, getWidth } from '../shared';

          const randomVar = 10;

          const Component = styled.div({
            ...importedStyles,
            height: \`\${HEIGHT}px\`,
            width: getWidth(10),
          });
        `,
        errors: [
          { messageId: 'no-imported-style-values' },
          { messageId: 'no-imported-style-values' },
          { messageId: 'no-imported-style-values' },
        ],
      },
      {
        name: 'Invalid cssMap call',
        code: `
          import { cssMap } from '@compiled/react';
          import { textColor, bgColor } from '../shared';

          const styles = cssMap({
            text: { color: textColor },
            bg: { background: bgColor },
          });
        `,
        errors: [
          { messageId: 'no-imported-style-values' },
          { messageId: 'no-imported-style-values' },
        ],
      },
      {
        name: 'Invalid style composition in css prop',
        code: `
          import { css } from '@compiled/react';
          import { buttonStyles } from '../shared';

          const styles = css({
            color: 'red',
          });

          export default () => <div css={[styles, buttonStyles]} />;
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
      {
        name: 'Importing value within style prop',
        code: `
          import { importedWidth } from '../shared';

          export default () => <div style={{ width: importedWidth }} />;
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
      {
        name: 'Importing member expression',
        code: `
          import { hello } from 'package';
          import { css } from '@compiled/react';
          
          const styles = css({
            color: hello.world,
          });
        `,
        errors: [{ messageId: 'no-imported-style-values' }],
      },
    ],
  },
);
