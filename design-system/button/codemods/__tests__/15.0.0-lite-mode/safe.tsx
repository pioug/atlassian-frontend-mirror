jest.autoMockOff();

import transformer from '../../15.0.0-lite-mode';
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
          <Button onClick={() => console.log('hi')}>click me</Button>
        );
      }
    `,
    expected: `
      import { Appearance } from '@atlaskit/button/types';
      import Button from '@atlaskit/button/custom-theme-button';

      export type Mine = Appearance & 'purple';

      function App() {
        return (
          <Button onClick={() => console.log('hi')}>click me</Button>
        );
      }
    `,
  });
});

describe('Changing <Button /> usage', () => {
  check({
    transformer,
    it: 'should move to custom theme button',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        return (
          <Button onClick={() => console.log('hi')}>click me</Button>
        );
      }
    `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/custom-theme-button';

      function App() {
        return (
          <Button onClick={() => console.log('hi')}>click me</Button>
        );
      }
  `,
  });

  check({
    transformer,
    it: 'should move over when not used in JSX',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      expect(Button).toBeTruthy();
    `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/custom-theme-button';

      expect(Button).toBeTruthy();
  `,
  });

  check({
    transformer,
    it: 'should respect self closing tags',
    original: `
      import React from 'react';
      import Button from '@atlaskit/button';

      function App() {
        return <Button onClick={() => console.log('hi')} />;
      }
    `,
    expected: `
      import React from 'react';
      import Button from '@atlaskit/button/custom-theme-button';

      function App() {
        return <Button onClick={() => console.log('hi')} />;
      }
  `,
  });

  check({
    transformer,
    it: 'should respect the existing alias',
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
      import AkButton from '@atlaskit/button/custom-theme-button';

      export function App() {
        return (
          <>
            <Button onClick={() => console.log('hi')} />
            <AkButton onClick={() => console.log('hi')} />
          </>
        );
      }
  `,
  });
});

describe('`type ButtonProps` to `type CustomButtonProps`', () => {
  check({
    transformer,
    it: 'should move to the new type',
    original: `
      import React from 'react';
      import Button, { ButtonProps } from '@atlaskit/button';

      function App() {
        return <Button>click me</Button>;
      }
    `,
    expected: `
      import React from 'react';
      import { CustomThemeButtonProps } from '@atlaskit/button/types';
      import Button from '@atlaskit/button/custom-theme-button';

      function App() {
        return <Button>click me</Button>;
      }
  `,
  });

  check({
    transformer,
    it: 'should respect aliasing',
    original: `
      import React from 'react';
      import Button, { ButtonProps as Foo } from '@atlaskit/button';

      export type Bar = Foo & { name: string };

      function App() {
        return <Button>click me</Button>;
      }
    `,
    expected: `
      import React from 'react';
      import { CustomThemeButtonProps as Foo } from '@atlaskit/button/types';
      import Button from '@atlaskit/button/custom-theme-button';

      export type Bar = Foo & { name: string };

      function App() {
        return <Button>click me</Button>;
      }
  `,
  });

  check({
    transformer,
    it: 'should avoid clashes',
    original: `
      import React from 'react';
      import { CustomThemeButtonProps } from './my-types';
      import Button, { ButtonProps } from '@atlaskit/button';

      export type Bar = CustomThemeButtonProps & ButtonProps & { name: string };

      function App() {
        return <Button>click me</Button>;
      }
    `,
    expected: `
      import React from 'react';
      import { CustomThemeButtonProps } from './my-types';
      import { CustomThemeButtonProps as DSCustomThemeButtonProps } from '@atlaskit/button/types';
      import Button from '@atlaskit/button/custom-theme-button';

      export type Bar = CustomThemeButtonProps & DSCustomThemeButtonProps & { name: string };

      function App() {
        return <Button>click me</Button>;
      }
  `,
  });

  check({
    transformer,
    it: 'should move from type entry point',
    original: `
      import React from 'react';
      import { ButtonProps } from '@atlaskit/button/types';
    `,
    expected: `
      import React from 'react';
      import { CustomThemeButtonProps } from '@atlaskit/button/types';
    `,
  });
});
