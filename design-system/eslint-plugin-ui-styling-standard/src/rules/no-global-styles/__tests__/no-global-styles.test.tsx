import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-global-styles', rule, {
  valid: [
    "import { css } from '@emotion/react';",
    "import { keyframes } from '@emotion/core';",
    "import styled from 'styled-components';",
  ],
  invalid: [
    {
      name: '[@emotion/react] Global',
      code: "import { Global } from '@emotion/react';",
      errors: [{ messageId: 'no-global-styles' }],
    },
    {
      name: '[@emotion/core] Global',
      code: "import { Global } from '@emotion/core';",
      errors: [{ messageId: 'no-global-styles' }],
    },
    {
      name: '[styled-components] injectGlobal',
      code: "import { injectGlobal } from 'styled-components';",
      errors: [{ messageId: 'no-global-styles' }],
    },
    {
      name: '[styled-components] createGlobalStyle',
      code: "import { createGlobalStyle } from 'styled-components';",
      errors: [{ messageId: 'no-global-styles' }],
    },
    {
      name: 'aliasing',
      code: "import { Global as EmotionGlobal } from '@emotion/react';",
      errors: [{ messageId: 'no-global-styles' }],
    },
    {
      name: 'style tag',
      code: `
        <style>
          {'.my-class { color: red; }'}
        </style>
      `,
      errors: [{ messageId: 'no-global-styles' }],
    },
  ],
});
