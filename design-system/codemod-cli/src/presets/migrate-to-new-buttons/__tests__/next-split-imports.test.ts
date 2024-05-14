import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/next-split-imports';

const check = createCheck(transformer);

describe('rename-imports', () => {
  check({
    it: 'should import default button from standard button entry point',
    original: `import Button from '@atlaskit/button';`,
    expected: `import Button from '@atlaskit/button/standard-button';`,
  });

  check({
    it: 'should replace with default import from loading-button',
    original: `import { LoadingButton } from '@atlaskit/button';`,
    expected: `import LoadingButton from '@atlaskit/button/loading-button';`,
  });

  check({
    it: 'should replace with default import from button-group',
    original: `import { ButtonGroup } from '@atlaskit/button';`,
    expected: `import ButtonGroup from '@atlaskit/button/button-group';`,
  });

  check({
    it: 'should replace with default import from custom-theme-button',
    original: `import { CustomThemeButton } from '@atlaskit/button';`,
    expected: `import CustomThemeButton from '@atlaskit/button/custom-theme-button';`,
  });

  check({
    it: 'should keep the alias name when import from new entry point',
    original: `import Button, { CustomThemeButton as CB } from '@atlaskit/button';`,
    expected: `
      import CB from '@atlaskit/button/custom-theme-button';
      import Button from '@atlaskit/button/standard-button';
    `,
  });

  check({
    it: 'should split imports into default imports',
    original: `import Button, { LoadingButton } from '@atlaskit/button';`,
    expected: `
      import LoadingButton from '@atlaskit/button/loading-button';
      import Button from '@atlaskit/button/standard-button';
    `,
  });

  check({
    it: 'should split the CustomThemeButton import from default and keep the type imports',
    original: `import { CustomThemeButton, ThemeProps, ThemeTokens } from '@atlaskit/button';`,
    expected: `
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { ThemeProps, ThemeTokens } from '@atlaskit/button';
    `,
  });

  check({
    it: 'should not modify import path',
    original: `
      import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
    `,
    expected: `
      import { UNSAFE_LINK_BUTTON as LinkButton } from '@atlaskit/button/unsafe';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
    `,
  });

  check({
    it: 'should add types to the type imports for Appearance import',
    original: `import { type Appearance } from '@atlaskit/button';`,
    expected: `import { type Appearance } from '@atlaskit/button/types';`,
  });

  check({
    it: 'should not split the type imports',
    original: `import { type LoadingButtonProps } from '@atlaskit/button/loading-button';`,
    expected: `import { type LoadingButtonProps } from '@atlaskit/button/loading-button';`,
  });

  check({
    it: 'should add types to the type imports for Spacing import',
    original: `import { Spacing } from '@atlaskit/button';`,
    expected: `import { Spacing } from '@atlaskit/button/types';`,
  });
});
