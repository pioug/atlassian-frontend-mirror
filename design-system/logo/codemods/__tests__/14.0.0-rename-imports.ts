jest.autoMockOff();

import transformer from '../14.0.0-rename-imports';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Logo code-mods', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { JiraCoreLogo } from '@atlaskit/logo';

    const Logo = () => (<JiraCoreLogo />);
    `,
    `
    import React from 'react';
    import { JiraWorkManagementLogo as JiraCoreLogo } from '@atlaskit/logo';

    const Logo = () => (<JiraCoreLogo />);
    `,
    'should alias the import using alternative components',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import {
      AtlassianIcon,
      JiraCoreLogo
    } from '@atlaskit/logo';
    const getProductIcon = (productId: string) => {
      switch (productId) {
        case 'jira-core':
          return JiraCoreIcon;
        default:
          return AtlassianIcon;
      }
    }
    const Logo = () => getProductIcon();
    `,
    `
    import React from 'react';
    import {
      AtlassianIcon,
      JiraWorkManagementLogo as JiraCoreLogo
    } from '@atlaskit/logo';
    const getProductIcon = (productId: string) => {
      switch (productId) {
        case 'jira-core':
          return JiraCoreIcon;
        default:
          return AtlassianIcon;
      }
    }
    const Logo = () => getProductIcon();
    `,
    'should alias the import using alternative components, and keep other logo components unchanged',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { JiraCoreLogo } from '@atlaskit/logo';

    const Logo = ({textColor}) => (<JiraCoreLogo textColor={textColor} />);
    `,
    `
    import React from 'react';
    import { JiraWorkManagementLogo as JiraCoreLogo } from '@atlaskit/logo';

    const Logo = ({textColor}) => (<JiraCoreLogo textColor={textColor} />);
    `,
    'should replace imports with alternative component with props unchanged',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import {
      JiraCoreWordmark,
      JiraCoreIcon
    } from '@atlaskit/logo';

    const Logo = () => (<><JiraCoreIcon /><JiraCoreWordmark /></>);
    `,
    `
    import React from 'react';
    import {
      JiraWorkManagementWordmark as JiraCoreWordmark,
      JiraWorkManagementIcon as JiraCoreIcon
    } from '@atlaskit/logo';

    const Logo = () => (<><JiraCoreIcon /><JiraCoreWordmark /></>);
    `,
    'should alias multiple imports using alternative components',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { JiraCoreLogo as JCLogo } from '@atlaskit/logo';

    const Logo = () => (<JCLogo />);
    `,
    `
    import React from 'react';
    import { JiraWorkManagementLogo as JCLogo } from '@atlaskit/logo';

    const Logo = () => (<JCLogo />);
    `,
    'should replace aliased import and JSX element with alternative components',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { StrideIcon } from '@atlaskit/logo';

    const Logo = () => (<StrideIcon />);
    `,
    `
    import React from 'react';
    /* TODO: (from codemod) This file uses the @atlaskit/logo \`StrideIcon\` 
    has now been removed with no alternative. */
    import { StrideIcon } from '@atlaskit/logo';

    const Logo = () => (<StrideIcon />);
    `,
    'should prompt user when using logo components with no alternatives',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { JiraCoreIcon, HipchatIcon } from '@atlaskit/logo';
    const Logo = () => (<><JiraCoreIcon /><HipchatIcon /></>);
    `,
    `
    import React from 'react';
    /* TODO: (from codemod) This file uses the @atlaskit/logo \`HipchatIcon\` 
    has now been removed with no alternative. */
    import { JiraWorkManagementIcon as JiraCoreIcon, HipchatIcon } from '@atlaskit/logo';
    const Logo = () => (<><JiraCoreIcon /><HipchatIcon /></>);
    `,
    'should alias imports using alternative component and propt user when using logo compontns with no alternatives',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    const MyComponent = () => (<div />);
    `,
    `
    import React from 'react';

    const MyComponent = () => (<div />);
    `,
    'should not modify files that are not using @atlaskit/logo',
  );
});
