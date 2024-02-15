const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
import transformer from '../codemods/next-split-imports';

describe('rename-imports', () => {
  defineInlineTest(
    transformer,
    {},
    `import Button from '@atlaskit/button';`,
    `import Button from '@atlaskit/button/standard-button';`,
    'should import default button from standard button entry point',
  );
  defineInlineTest(
    transformer,
    {},
    `import { LoadingButton } from '@atlaskit/button';`,
    `import LoadingButton from '@atlaskit/button/loading-button';`,
    'should replace with default import from loading-button',
  );
  defineInlineTest(
    transformer,
    {},
    `import { ButtonGroup } from '@atlaskit/button';`,
    `import ButtonGroup from '@atlaskit/button/button-group';`,
    'should replace with default import from button-group',
  );
  defineInlineTest(
    transformer,
    {},
    `import { CustomThemeButton } from '@atlaskit/button';`,
    `import CustomThemeButton from '@atlaskit/button/custom-theme-button';`,
    'should replace with default import from custom-theme-button',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button, { CustomThemeButton as CB } from '@atlaskit/button';`,
    `import CB from '@atlaskit/button/custom-theme-button';
import Button from '@atlaskit/button/standard-button';
`,
    'should keep the alias name when import from new entry point',
  );
  defineInlineTest(
    transformer,
    {},
    `import Button, { LoadingButton } from '@atlaskit/button';`,
    `import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
`,
    'should split imports into default imports',
  );
  defineInlineTest(
    transformer,
    {},
    `import { CustomThemeButton, ThemeProps, ThemeTokens } from '@atlaskit/button';`,
    `import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import { ThemeProps, ThemeTokens } from '@atlaskit/button';
`,
    'should split the CustomThemeButton import from default and keep the type imports',
  );
  defineInlineTest(
    transformer,
    {},
    `import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
    import CustomThemeButton from '@atlaskit/button/custom-theme-button';`,
    `import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
    import CustomThemeButton from '@atlaskit/button/custom-theme-button';`,
    'should not modify import path',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { type Appearance } from '@atlaskit/button';`,
    `import { type Appearance } from '@atlaskit/button/types';`,
    'should add types to the type imports for Appearance import',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { type LoadingButtonProps } from '@atlaskit/button/loading-button';`,
    `import { type LoadingButtonProps } from '@atlaskit/button/loading-button';`,
    'should not split the type imports',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `import { Spacing } from '@atlaskit/button';`,
    `import { Spacing } from '@atlaskit/button/types';`,
    'should add types to the type imports for Spacing import',
  );
});
