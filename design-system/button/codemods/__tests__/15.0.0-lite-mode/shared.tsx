jest.autoMockOff();

import safe from '../../15.0.0-lite-mode';
import optimistic from '../../optimistic-15.0.0-lite-mode';
import { check } from '../_framework';

[
  {
    name: 'safe',
    transformer: safe,
  },
  {
    name: 'optimistic',
    transformer: optimistic,
  },
].forEach(({ name, transformer }) => {
  describe(`Transformer: ${name}`, () => {
    describe('Change `type ButtonAppearances` to `type Appearance`', () => {
      check({
        it: 'should rename ButtonAppearances type to Appearance',
        transformer,
        original: `
          import { ButtonAppearances } from '@atlaskit/button';

          const value: ButtonAppearances = 'primary';
        `,
        expected: `
          import { Appearance } from '@atlaskit/button/types';

          const value: Appearance = 'primary';
        `,
      });

      check({
        it: 'should respect existing aliasing',
        transformer,
        original: `
          import { ButtonAppearances as CustomAppearance } from '@atlaskit/button';

          const value: CustomAppearance = 'primary';
        `,
        expected: `
          import { Appearance as CustomAppearance } from '@atlaskit/button/types';

          const value: CustomAppearance = 'primary';
        `,
      });

      check({
        it: 'should fallback to a `DSButtonAppearance` type alias if the `Appearance` identifier name is unavailable',
        transformer,
        original: `
          import { Appearance } from 'some-other-package';
          import { ButtonAppearances } from '@atlaskit/button';

          const value1: Appearance = 4;
          const value2: ButtonAppearances = 'primary';
        `,
        expected: `
          import { Appearance } from 'some-other-package';
          import { Appearance as DSButtonAppearance } from '@atlaskit/button/types';

          const value1: Appearance = 4;
          const value2: DSButtonAppearance = 'primary';
        `,
      });

      check({
        it: 'should use the existing type entry point',
        transformer,
        original: `
          import { ButtonAppearances as CustomAppearance } from '@atlaskit/button/types';

          const value: CustomAppearance = 'primary';
        `,
        expected: `
          import { Appearance as CustomAppearance } from '@atlaskit/button/types';

          const value: CustomAppearance = 'primary';
        `,
      });
    });

    describe('ButtonGroup', () => {
      const expectedImport: string =
        transformer === optimistic
          ? '@atlaskit/button/standard-button'
          : '@atlaskit/button/custom-theme-button';

      check({
        transformer,
        it: 'should move button group over to the new import',
        original: `
          import React from 'react';
          import Button, { ButtonGroup } from '@atlaskit/button';

          function App() {
            return <ButtonGroup><Button>click me</Button></ButtonGroup>;
          }
        `,
        expected: `
          import React from 'react';
          import ButtonGroup from '@atlaskit/button/button-group';
          import Button from '${expectedImport}';

          function App() {
            return <ButtonGroup><Button>click me</Button></ButtonGroup>;
          }
      `,
      });

      check({
        transformer,
        it: 'should respect aliasing',
        original: `
          import React from 'react';
          import Button, { ButtonGroup as AkButtonGroup } from '@atlaskit/button';

          function App() {
            return <AkButtonGroup><Button>click me</Button></AkButtonGroup>;
          }
        `,
        expected: `
          import React from 'react';
          import AkButtonGroup from '@atlaskit/button/button-group';
          import Button from '${expectedImport}';

          function App() {
            return <AkButtonGroup><Button>click me</Button></AkButtonGroup>;
          }
      `,
      });

      check({
        transformer,
        it: 'avoid clashing when shifting',
        original: `
          import React from 'react';
          import { ButtonGroup } from '@atlaskit/button';

          expect(ButtonGroup).toBeTruthy();
        `,
        expected: `
          import React from 'react';
          import ButtonGroup from '@atlaskit/button/button-group';

          expect(ButtonGroup).toBeTruthy();
      `,
      });

      check({
        transformer,
        it: 'should move over when not used in JSX',
        original: `
          import React from 'react';
          import { ButtonGroup } from '@atlaskit/button';

          expect(ButtonGroup).toBeTruthy();
        `,
        expected: `
          import React from 'react';
          import ButtonGroup from '@atlaskit/button/button-group';

          expect(ButtonGroup).toBeTruthy();
      `,
      });

      check({
        transformer,
        it: 'should avoid touching unrelated button groups',
        original: `
          import React from 'react';
          import Button from '@atlaskit/button';
          import { ButtonGroup } from './something';

          function App() {
            return <ButtonGroup><Button>click me</Button></ButtonGroup>;
          }
        `,
        expected: `
          import React from 'react';
          import Button from '${expectedImport}';
          import { ButtonGroup } from './something';

          function App() {
            return <ButtonGroup><Button>click me</Button></ButtonGroup>;
          }
      `,
      });
    });

    describe('Theme', () => {
      check({
        it: 'should move Theme to the custom-theme-button export',
        transformer,
        original: `
          import React from 'react';
          import { Theme } from '@atlaskit/button';
        `,
        expected: `
          import React from 'react';
          import { Theme } from '@atlaskit/button/custom-theme-button';
        `,
      });

      check({
        it: 'should respect aliasing',
        transformer,
        original: `
          import React from 'react';
          import { Theme as ButtonTheme } from '@atlaskit/button';

          type Value = ButtonTheme & { foo: string };
        `,
        expected: `
          import React from 'react';
          import { Theme as ButtonTheme } from '@atlaskit/button/custom-theme-button';

          type Value = ButtonTheme & { foo: string };
        `,
      });

      const expectedName: string =
        transformer === optimistic ? 'CustomThemeButton' : 'Button';

      check({
        it: 'should merge imports',
        transformer,
        original: `
          import React from 'react';
          import Button, { Theme as ButtonTheme } from '@atlaskit/button';

          function App() {
            return (
              <ButtonTheme.Provider value={customTheme}>
                <Button theme={customTheme}>click me</Button>
              </ButtonTheme.Provider>
            );
          }
        `,
        expected: `
          import React from 'react';
          import ${expectedName}, { Theme as ButtonTheme } from '@atlaskit/button/custom-theme-button';

          function App() {
            return (
              <ButtonTheme.Provider value={customTheme}>
                <${expectedName} theme={customTheme}>click me</${expectedName}>
              </ButtonTheme.Provider>
            );
          }
        `,
      });
    });
  });
});
