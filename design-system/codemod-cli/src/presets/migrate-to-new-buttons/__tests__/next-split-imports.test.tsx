import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/next-split-imports';

const check = createCheck(transformer);

describe('rename-imports', () => {
	describe('should import default button from standard button entry point', () => {
		check({
			it: 'with default import',
			original: `import Button from '@atlaskit/button';`,
			expected: `import Button from '@atlaskit/button/standard-button';`,
		});
		check({
			it: 'with aliased import',
			original: `import AkButton from '@atlaskit/button';`,
			expected: `import AkButton from '@atlaskit/button/standard-button';`,
		});
		check({
			it: 'with mixed imports',
			original: `
        import Button from '@atlaskit/button';
        import StandardButton from '@atlaskit/button/standard-button';

        const App = () => (
          <>
            <Button>Hello</Button>
            <StandardButton>Hello</StandardButton>
          </>
        );
      `,
			expected: `
        import StandardButton from '@atlaskit/button/standard-button';

        const App = () => (
          <>
            <StandardButton>Hello</StandardButton>
            <StandardButton>Hello</StandardButton>
          </>
        );
      `,
		});
	});

	describe('should replace with default import from loading-button', () => {
		check({
			it: 'with standard import',
			original: `import { LoadingButton } from '@atlaskit/button';`,
			expected: `import LoadingButton from '@atlaskit/button/loading-button';`,
		});
		check({
			it: 'with aliased import',
			original: `import { LoadingButton as FooLoadingButton } from '@atlaskit/button';`,
			expected: `import FooLoadingButton from '@atlaskit/button/loading-button';`,
		});
		check({
			it: 'with mixed imports',
			original: `
        import { LoadingButton } from '@atlaskit/button';
        import DirectLoadingButton from '@atlaskit/button/loading-button';

        const App = () => (
          <>
            <LoadingButton isLoading>Hello</LoadingButton>
            <DirectLoadingButton isLoading>Hello</DirectLoadingButton>
          </>
        );
      `,
			expected: `
        import DirectLoadingButton from '@atlaskit/button/loading-button';

        const App = () => (
          <>
            <DirectLoadingButton isLoading>Hello</DirectLoadingButton>
            <DirectLoadingButton isLoading>Hello</DirectLoadingButton>
          </>
        );
      `,
		});
	});

	describe('should replace with default import from button-group', () => {
		check({
			it: 'with standard import',
			original: `import { ButtonGroup } from '@atlaskit/button';`,
			expected: `import ButtonGroup from '@atlaskit/button/button-group';`,
		});
		check({
			it: 'with aliased import',
			original: `import { ButtonGroup as FooButtonGroup } from '@atlaskit/button';`,
			expected: `import FooButtonGroup from '@atlaskit/button/button-group';`,
		});
		check({
			it: 'with mixed imports',
			original: `
        import { ButtonGroup } from '@atlaskit/button';
        import DirectButtonGroup from '@atlaskit/button/button-group';

        const App = () => (
          <>
            <ButtonGroup>Hello</ButtonGroup>
            <DirectButtonGroup>Hello</DirectButtonGroup>
          </>
        );
      `,
			expected: `
        import DirectButtonGroup from '@atlaskit/button/button-group';

        const App = () => (
          <>
            <DirectButtonGroup>Hello</DirectButtonGroup>
            <DirectButtonGroup>Hello</DirectButtonGroup>
          </>
        );
      `,
		});
	});

	describe('should replace with default import from custom-theme-button', () => {
		check({
			it: 'with standard import',
			original: `import { CustomThemeButton } from '@atlaskit/button';`,
			expected: `import CustomThemeButton from '@atlaskit/button/custom-theme-button';`,
		});

		check({
			it: 'with aliased import',
			original: `import Button, { CustomThemeButton as CB } from '@atlaskit/button';`,
			expected: `
        import CB from '@atlaskit/button/custom-theme-button';
        import Button from '@atlaskit/button/standard-button';
      `,
		});
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
      import Button from '@atlaskit/button/new';
      import CustomThemeButton from '@atlaskit/button/custom-theme-button';
    `,
		expected: `
      import Button from '@atlaskit/button/new';
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
