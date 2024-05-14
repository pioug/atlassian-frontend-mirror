import outdent from 'outdent';

import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

const importSources = [
  '@emotion/core',
  '@emotion/react',
  '@emotion/styled',
  'styled-components',
];

tester.run('imports - fixable', rule, {
  valid: [],
  invalid: [
    {
      name: '[@emotion/core] - supported imports with aliasing',
      code: `
        import { css as c, keyframes as kf } from '@emotion/core';
      `,
      output: `
        import { css as c, keyframes as kf } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[@emotion/react] - supported imports with aliasing',
      code: `
        import { css as c, keyframes as kf } from '@emotion/react';
      `,
      output: `
        import { css as c, keyframes as kf } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[@emotion/styled] - supported imports with aliasing',
      code: `
        import s from '@emotion/styled';
      `,
      output: `
        import { styled as s } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[styled-components] - supported imports with aliasing',
      code: `
        import s, { css as c, keyframes as kf } from 'styled-components';
      `,
      output: `
        import { css as c, keyframes as kf, styled as s } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[@emotion/core] - with existing compiled import',
      code: outdent`
        import { css } from '@emotion/core';
        import { styled } from '@compiled/react';
      `,
      output: outdent`

        import { styled, css } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[@emotion/react] - with existing compiled import',
      code: outdent`
        import { css } from '@emotion/react';
        import { styled } from '@compiled/react';
      `,
      output: outdent`

        import { styled, css } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[@emotion/styled] - with existing compiled import',
      code: outdent`
        import styled from '@emotion/styled';
        import { css } from '@compiled/react';
      `,
      output: outdent`

        import { css, styled } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: '[styled-components] - with existing compiled import',
      code: outdent`
        import styled from 'styled-components';
        import { css } from '@compiled/react';
      `,
      output: outdent`

        import { css, styled } from '@compiled/react';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
  ],
});

/**
 * These test cases have no auto-fix because we are considering
 * them unsafe to automatically convert.
 */
tester.run('imports - not fixable', rule, {
  valid: [],
  invalid: importSources.flatMap((importSource) => [
    {
      name: `[${importSource}] namespace import`,
      code: `
        import * as namespace from '${importSource}';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] unsupported import`,
      code: `
        import { type CSSObject } from '${importSource}';
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
  ]),
});
