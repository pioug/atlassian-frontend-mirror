jest.autoMockOff();

import transformer from '../../optimistic-15.0.0-lite-mode';
import { check } from '../_framework';

describe('Change `type ButtonAppearances` to `type Appearance`', () => {
  check({
    transformer,
    it: 'should separate types into a different export from the components',
    original: `
      import Button, { ButtonAppearances } from '@atlaskit/button';

      export type Mine = ButtonAppearances & 'purple';

      function App() {
        return (
          <Button onClick={() => console.log('hi')}>standard button</Button>
        );
      }
    `,
    expected: `
      import { Appearance } from '@atlaskit/button/types';
      import Button from '@atlaskit/button/standard-button';

      export type Mine = Appearance & 'purple';

      function App() {
        return <Button onClick={() => console.log('hi')}>standard button</Button>;
      }
    `,
  });
});

describe('Changing <Button /> usage', () => {
  check({
    transformer,
    it: 'should move to standard button',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        return (
          <Button onClick={() => console.log('hi')}>standard button</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/standard-button';

      function App() {
        return <Button onClick={() => console.log('hi')}>standard button</Button>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to standard button (self closing button)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        return <Button onClick={() => console.log('hi')} />;
      }
    `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/standard-button';

      function App() {
        return <Button onClick={() => console.log('hi')} />;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to standard button (when fallback is needed)',
    original: `
      import React from 'react';
      import Button from './our-button';
      import AkButton from '@atlaskit/button';

      export function App() {
        return (
          <>
            <Button onClick={() => console.log('hi')} />
            <AkButton onClick={() => console.log('hi')} />
          </>
        );
      }
    `,
    expected: `
      import React from 'react';
      import Button from './our-button';
      import DSButton from '@atlaskit/button/standard-button';

      export function App() {
        return <>
          <Button onClick={() => console.log('hi')} />
          <DSButton onClick={() => console.log('hi')} />
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to loading button',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { getIsLoading } from './get-is-loading';

      function App() {
        return (
          <>
            <Button isLoading>loading button</Button>
            <Button isLoading={getIsLoading()}>loading button</Button>
          </>
        );
      }
    `,
    expected: `
      import React from 'react';
      import LoadingButton from '@atlaskit/button/loading-button';
      import { getIsLoading } from './get-is-loading';

      function App() {
        return <>
          <LoadingButton isLoading>loading button</LoadingButton>
          <LoadingButton isLoading={getIsLoading()}>loading button</LoadingButton>
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to loading button (when fallback is needed)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import LoadingButton from './our-buttons';

      function App() {
        return (
          <>
            <Button isLoading>loading button</Button>
          </>
        );
      }
    `,
    expected: `
      import React from 'react';
      import DSLoadingButton from '@atlaskit/button/loading-button';
      import LoadingButton from './our-buttons';

      function App() {
        return <>
          <DSLoadingButton isLoading>loading button</DSLoadingButton>
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to custom theme button',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { customTheme } from './theme';

      function App() {
        return (
          <>
            <Button theme={customTheme}>custom theme button</Button>
            <Button isLoading theme={customTheme}>custom theme button</Button>
          </>
        );
      }
    `,
    expected: `
      import React from 'react';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { customTheme } from './theme';

      function App() {
        return <>
          <CustomThemeButton theme={customTheme}>custom theme button</CustomThemeButton>
          <CustomThemeButton isLoading theme={customTheme}>custom theme button</CustomThemeButton>
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to custom theme button (when fallback is needed)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { customTheme } from './theme';
      import CustomThemeButton from './our-buttons';

      function App() {
        return (
          <>
            <CustomThemeButton>hey</CustomThemeButton>
            <Button theme={customTheme}>custom theme button</Button>
            <Button isLoading theme={customTheme}>custom theme button</Button>
          </>
        );
      }
    `,
    expected: `
      import React from 'react';
      import DSCustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { customTheme } from './theme';
      import CustomThemeButton from './our-buttons';

      function App() {
        return <>
          <CustomThemeButton>hey</CustomThemeButton>
          <DSCustomThemeButton theme={customTheme}>custom theme button</DSCustomThemeButton>
          <DSCustomThemeButton isLoading theme={customTheme}>custom theme button</DSCustomThemeButton>
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should use CustomThemeButton in a file that uses Theme',
    original: `
      import React from 'react';
      import Button, { Theme } from '@atlaskit/button';
      import { customTheme } from './custom-theme';

      function App() {
        return <>
          <Theme.Provider value={customTheme}>
            <Button isLoading>click me</Button>
          </Theme.Provider>
          <Button>click me</Button>
        </>
      }
    `,
    expected: `
      /* TODO: (from codemod) Using "import { Theme } from '@atlaskit/button/custom-theme-button" in a file
      will cause all buttons in that file to be safely converted to a <CustomThemeButton/> */
      import React from 'react';
      import CustomThemeButton, { Theme } from '@atlaskit/button/custom-theme-button';
      import { customTheme } from './custom-theme';

      function App() {
        return <>
          <Theme.Provider value={customTheme}>
            <CustomThemeButton isLoading>click me</CustomThemeButton>
          </Theme.Provider>
          <CustomThemeButton>click me</CustomThemeButton>
        </>;
      }
    `,
  });

  check({
    transformer,
    it: 'should move to the correct button for prop usages',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { getIsLoading, customTheme } from './util';

      function App() {
        return (
          <>
            <Button isLoading={getIsLoading()}>Loading button</Button>
            <Button theme={customTheme}>custom theme button</Button>
            <Button isLoading={getIsLoading()} theme={customTheme}>custom theme button</Button>
            <Button>standard button</Button>
          </>
        );
      }
        `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/standard-button';
      import LoadingButton from '@atlaskit/button/loading-button';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { getIsLoading, customTheme } from './util';

      function App() {
        return <>
          <LoadingButton isLoading={getIsLoading()}>Loading button</LoadingButton>
          <CustomThemeButton theme={customTheme}>custom theme button</CustomThemeButton>
          <CustomThemeButton isLoading={getIsLoading()} theme={customTheme}>custom theme button</CustomThemeButton>
          <Button>standard button</Button>
        </>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move to the correct button for prop usages (with fallbacks)',
    original: `
      import React from 'react';
      import AkButton from '@atlaskit/button';
      import { getIsLoading, customTheme } from './util';
      import { Button, LoadingButton, CustomThemeButton } from './our-buttons';

      function App() {
        return (
          <>
            <AkButton isLoading={getIsLoading()}>Loading button</AkButton>
            <AkButton theme={customTheme}>custom theme button</AkButton>
            <AkButton isLoading={getIsLoading()} theme={customTheme}>custom theme button</AkButton>
            <AkButton>standard button</AkButton>
          </>
        );
      }
        `,
    expected: `
      import React from 'react';
      import DSButton from '@atlaskit/button/standard-button';
      import DSLoadingButton from '@atlaskit/button/loading-button';
      import DSCustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { getIsLoading, customTheme } from './util';
      import { Button, LoadingButton, CustomThemeButton } from './our-buttons';

      function App() {
        return <>
          <DSLoadingButton isLoading={getIsLoading()}>Loading button</DSLoadingButton>
          <DSCustomThemeButton theme={customTheme}>custom theme button</DSCustomThemeButton>
          <DSCustomThemeButton isLoading={getIsLoading()} theme={customTheme}>custom theme button</DSCustomThemeButton>
          <DSButton>standard button</DSButton>
        </>;
      }
  `,
  });
});

describe('Non exclusive JSX usage of <Button />', () => {
  check({
    transformer,
    it: 'should use standard button if Button is not used in JSX',
    original: `
      import AkButton from '@atlaskit/button';

      export default { button: AkButton };
    `,
    expected: `
      /* TODO: (from codemod) This file does not exclusively use Button in JSX.
      The codemod is unable to know which button variant, so it is using
      the standard button: "@atlaskit/button/standard-button".

      Please validate this decision.
      You might need to change the usage of Button to either LoadingButton or CustomThemeButton */
      import AkButton from '@atlaskit/button/standard-button';

      export default { button: AkButton };
    `,
  });

  check({
    transformer,
    it:
      'should use standard button if Button is used in JSX and also not in JSX',
    original: `
      import React from 'react';
      import Button from './our-button';
      import AkButton from '@atlaskit/button';

      // Used in JSX
      function App() {
        return (
          <>
            <Button onClick={() => console.log('hi')} />
            <AkButton onClick={() => console.log('hi')} />
          </>
        );
      }

      // Not used in JSX
      expect(AkButton).toBe(true);
    `,
    expected: `
      import React from 'react';
      import Button from './our-button';
      /* TODO: (from codemod) This file does not exclusively use Button in JSX.
      The codemod is unable to know which button variant, so it is using
      the standard button: "@atlaskit/button/standard-button".

      Please validate this decision.
      You might need to change the usage of Button to either LoadingButton or CustomThemeButton */
      import AkButton from '@atlaskit/button/standard-button';

      // Used in JSX
      function App() {
        return (
          <>
            <Button onClick={() => console.log('hi')} />
            <AkButton onClick={() => console.log('hi')} />
          </>
        );
      }

      // Not used in JSX
      expect(AkButton).toBe(true);
  `,
  });
});

describe('Spreading props', () => {
  check({
    transformer,
    it:
      'should try to choose the right button if there are locally spread values (seperate object)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        const props = {
          isLoading: true,
          onClick: () => console.log('hi'),
        };
        return (
          <Button {...props}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import LoadingButton from '@atlaskit/button/loading-button';

      function App() {
        const props = {
          isLoading: true,
          onClick: () => console.log('hi'),
        };
        return <LoadingButton {...props}>click me</LoadingButton>;
      }
  `,
  });

  check({
    transformer,
    it:
      'should try to choose the right button if there are locally spread values (inline object)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        return (
          <Button {...({ isLoading: true })}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import LoadingButton from '@atlaskit/button/loading-button';

      function App() {
        return <LoadingButton {...({ isLoading: true })}>click me</LoadingButton>;
      }
  `,
  });

  check({
    transformer,
    it:
      'should try to choose the right button if there are multiple local spread values',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      const first = {
        onClick: () => console.log('hi'),
      };
      const second = {
        isLoading: true,
      };

      function App() {
        return (
          <Button {...first} {...second}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import LoadingButton from '@atlaskit/button/loading-button';

      const first = {
        onClick: () => console.log('hi'),
      };
      const second = {
        isLoading: true,
      };

      function App() {
        return <LoadingButton {...first} {...second}>click me</LoadingButton>;
      }
    `,
  });

  check({
    transformer,
    it:
      'should try to choose the right button if there are locally spread values (custom theme button)',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { customTheme } from './our-theme';

      function App() {
        const props = {
          isLoading: true,
          theme: customTheme,
          onClick: () => console.log('hi'),
        };
        return (
          <Button {...props}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { customTheme } from './our-theme';

      function App() {
        const props = {
          isLoading: true,
          theme: customTheme,
          onClick: () => console.log('hi'),
        };
        return <CustomThemeButton {...props}>click me</CustomThemeButton>;
      }
  `,
  });

  check({
    transformer,
    it:
      'should try to choose the right button if there is a spread value being mixed with a local values',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { customTheme } from './our-theme';

      function App() {
        const props = {
          theme: customTheme,
        };
        return (
          <Button isLoading {...props}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { customTheme } from './our-theme';

      function App() {
        const props = {
          theme: customTheme,
        };
        return <CustomThemeButton isLoading {...props}>click me</CustomThemeButton>;
      }
  `,
  });

  check({
    transformer,
    it: 'should fallback to CustomThemeButton if there is an unknown spread',
    // ...itShouldLogWarning({ times: 2 }),
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';
      import { getProps } from './get-props';

      function First(props) {
        return <Button {...props}>click me</Button>;
      }

      function Second() {
        return <Button {...getProps()}>click me</Button>;
      }
    `,
    expected: `
      /* TODO: (from codemod) Detected spreading props (<Button {...props} />) that was too complex for our codemod to understand
      Our codemod will only look at inline objects, or objects defined in the same file (ObjectExpression's)
      We have opted for our safest upgrade component in this file: '<CustomThemeButton />' */
      import React from 'react';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
      import { getProps } from './get-props';

      function First(props) {
        return <CustomThemeButton {...props}>click me</CustomThemeButton>;
      }

      function Second() {
        return <CustomThemeButton {...getProps()}>click me</CustomThemeButton>;
      }
  `,
  });
});

describe('ButtonGroup', () => {});

describe('`type ButtonProps`', () => {
  check({
    transformer,
    it: 'should move to the new standard button props',
    original: `
      import React from 'react';
      import Button, { ButtonProps } from '@atlaskit/button';

      function App() {
        return <Button>click me</Button>;
      }
    `,
    expected: `
      import React from 'react';

      /* TODO: (from codemod) Verify ButtonProps is the right prop type
      You might need the LoadingButtonProps, CustomButtonProps types which can be imported from '@atlaskit/button/types' */
      import { ButtonProps } from '@atlaskit/button/types';

      import Button from '@atlaskit/button/standard-button';

      function App() {
        return <Button>click me</Button>;
      }
  `,
  });
});
