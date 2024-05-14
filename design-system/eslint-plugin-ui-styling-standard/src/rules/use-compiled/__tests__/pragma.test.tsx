import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('jsxImportSource pragma - fixable', rule, {
  valid: [],
  invalid: ['@emotion/core', '@emotion/react']
    .flatMap((importSource) => [
      {
        name: `[${importSource}] fixable import exists`,
        code: `
          /** @jsxImportSource @emotion/react */

          import { css } from '${importSource}';
        `,
        /**
         * This output does not have a fixed pragma because the rule tester
         * only does a single pass of the fixers.
         *
         * In reality up to 10 passes are done. We can see that from this state
         * the pragma does get fixed in the test below.
         */
        output: `
          /** @jsxImportSource @emotion/react */

          import { css } from '@compiled/react';
        `,
        errors: [{ messageId: 'use-compiled' }, { messageId: 'use-compiled' }],
        options: [{ canAutoFix: true }],
      },
    ])
    .concat([
      {
        name: `[@emotion/styled] fixable import exists`,
        code: `
          /** @jsxImportSource @emotion/react */

          import styled from '@emotion/styled';
        `,
        /**
         * This output does not have a fixed pragma because the rule tester
         * only does a single pass of the fixers.
         *
         * In reality up to 10 passes are done. We can see that from this state
         * the pragma does get fixed in the test below.
         */
        output: `
          /** @jsxImportSource @emotion/react */

          import { styled } from '@compiled/react';
        `,
        errors: [{ messageId: 'use-compiled' }, { messageId: 'use-compiled' }],
        options: [{ canAutoFix: true }],
      },
      {
        name: 'no @emotion imports and has @compiled/react import',
        code: `
          /** @jsxImportSource @emotion/react */

          import { css } from '@compiled/react';
        `,
        output: `
          /** @jsxImportSource @compiled/react */

          import { css } from '@compiled/react';
        `,
        errors: [{ messageId: 'use-compiled' }],
        options: [{ canAutoFix: true }],
      },
    ]),
});

tester.run('jsxImportSource pragma - not fixable', rule, {
  valid: [],
  invalid: [
    {
      name: 'no @compiled/react import',
      code: `/** @jsxImportSource @emotion/react */`,
      errors: [{ messageId: 'use-compiled' }],
    },
    {
      name: 'non-fixable @emotion/core import exists',
      code: `
        /** @jsxImportSource @emotion/react */

        import { type CSSObject } from '@emotion/core';
      `,
      errors: [{ messageId: 'use-compiled' }, { messageId: 'use-compiled' }],
    },
    {
      name: 'non-fixable @emotion/react import exists',
      code: `
        /** @jsxImportSource @emotion/react */

        import { type CSSObject } from '@emotion/react';
      `,
      errors: [{ messageId: 'use-compiled' }, { messageId: 'use-compiled' }],
    },
    {
      name: 'non-fixable @emotion/styled import exists',
      code: `
        /** @jsxImportSource @emotion/react */

        import { type CSSObject } from '@emotion/styled';
      `,
      errors: [{ messageId: 'use-compiled' }, { messageId: 'use-compiled' }],
    },
  ],
});
