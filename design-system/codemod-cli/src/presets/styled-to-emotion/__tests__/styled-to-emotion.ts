jest.autoMockOff();

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

import transformer from '../styled-to-emotion';

describe('Transform import', () => {
  defineInlineTest(
    transformer,
    {},
    "import styled from 'styled-components';",
    "import styled from '@emotion/styled';",
    'it transforms standard styled-component imports',
  );

  defineInlineTest(
    transformer,
    {},
    `
    import styled from 'styled-components';
    import react from 'react';
    `,
    `
    import styled from '@emotion/styled';
    import react from 'react';
    `,
    'it ignores other imports',
  );

  defineInlineTest(
    transformer,
    {},
    "import { keyframes } from 'styled-components';",
    "import { keyframes } from '@emotion/core';",
    'it correctly detects misc core imports',
  );

  defineInlineTest(
    transformer,
    {},
    "import styled, { css } from 'styled-components';",
    "import { css } from '@emotion/core';\nimport styled from '@emotion/styled';",
    'it correctly splits out core and styled imports',
  );

  defineInlineTest(
    transformer,
    {},
    "import styled, { ThemeProvider } from 'styled-components';",
    `
    import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
    `,
    'it correctly splits out core and themed imports',
  );

  defineInlineTest(
    transformer,
    {},
    "import styled, { css, ThemeProvider, withTheme } from 'styled-components';",
    `
    import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { ThemeProvider, withTheme } from 'emotion-theming';
    `,
    'it correctly splits out core and multiple themed imports',
  );
});
