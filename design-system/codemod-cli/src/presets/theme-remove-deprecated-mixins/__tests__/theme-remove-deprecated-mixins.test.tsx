jest.autoMockOff();

import jscodeshift from 'jscodeshift';

import codemod from '../theme-remove-deprecated-mixins';

interface Options {
	parser: string;
}

function applyTransform(
	transform: any,
	input: string,
	options: Options = {
		parser: 'tsx',
	},
) {
	const transformer = transform.default ? transform.default : transform;
	const output = transformer(
		{ source: input },
		{ jscodeshift: jscodeshift.withParser(options.parser) },
	);

	return (output || '').trim();
}

describe('theme-remove-deprecated-mixins', () => {
	it('should leave non-theme imports alone', () => {
		const result = applyTransform(
			codemod,
			`
import { backgroundHover } from '@atlaskit/not/theme/colors';

const Foo = css\`
  background-color: \${backgroundHover()};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		      "import { backgroundHover } from '@atlaskit/not/theme/colors';

		      const Foo = css\`
		        background-color: \${backgroundHover()};
		      \`;"
	    `);
	});

	it('should non-theme mixins alone', () => {
		const result = applyTransform(
			codemod,
			`
import { backgroundHover } from '@atlaskit/not/theme/colors';

const Foo = css\`
  background-color: \${backgroundHover()};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		      "import { backgroundHover } from '@atlaskit/not/theme/colors';

		      const Foo = css\`
		        background-color: \${backgroundHover()};
		      \`;"
	    `);
	});

	it('should perform complete replacement if legacy theming `themed()` detected', () => {
		const result = applyTransform(
			codemod,
			`
  import { background } from '@atlaskit/theme/colors';

  const Foo = (props) => css\`
    background: \${background};
  \`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		"import { token } from "@atlaskit/tokens";
		  import { N0 } from '@atlaskit/theme/colors';

		  const Foo = (props) => css\`
		    background: \${token("elevation.surface", N0)};
		  \`;"
	`);
	});

	it('should perform static replacement if legacy theming is not `themed()` detected', () => {
		const result = applyTransform(
			codemod,
			`
import { backgroundHover } from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${backgroundHover()};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		"import { token } from "@atlaskit/tokens";
		import { N30 } from '@atlaskit/theme/colors';

		const Foo = css\`
		  background-color: \${token("color.background.neutral.hovered", N30)};
		\`;"
	`);
	});

	it('legacy theming detected via argument usage', () => {
		const result = applyTransform(
			codemod,
			`
import { N50, background, N30 } from '@atlaskit/theme/colors';

const Foo = (props) => css\`
  color: \${N50};
  border-color: \${N30};
  background: \${background(props)};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		"import { token } from "@atlaskit/tokens";
		import { N50, N30, N0 } from '@atlaskit/theme/colors';

		const Foo = (props) => css\`
		  color: \${N50};
		  border-color: \${N30};
		  background: \${token("elevation.surface", N0)};
		\`;"
	`);
	});

	it('should correctly replace mixins wrapped in a token', () => {
		const result = applyTransform(
			codemod,
			`
import { token } from '@atlaskit/tokens';
import { backgroundHover } from '@atlaskit/theme/colors';

const Foo = (props) => css\`
  background-color: \${token('color.background.danger', backgroundHover(props))};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		"import { token } from '@atlaskit/tokens';
		import { N30 } from '@atlaskit/theme/colors';

		const Foo = (props) => css\`
		  background-color: \${token("color.background.danger", N30)};
		\`;"
	`);
	});

	it('should correctly replace static mixins wrapped in a token', () => {
		const result = applyTransform(
			codemod,
			`
import { token } from '@atlaskit/tokens';
import { backgroundHover } from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${token('color.background.neutral.subtle.hovered', backgroundHover())};
\`;`,
		);

		expect(result).toMatchInlineSnapshot(`
		      "import { token } from '@atlaskit/tokens';
		      import { N30 } from '@atlaskit/theme/colors';

		      const Foo = css\`
		        background-color: \${token('color.background.neutral.subtle.hovered', N30)};
		      \`;"
	    `);
	});

	it('should not detect JSX properties', () => {
		const result = applyTransform(
			codemod,
			`export const HighlightButton = () => <PipeModalHeader heading="Discover pipes" />`,
		);

		expect(result).toMatchInlineSnapshot(
			`"export const HighlightButton = () => <PipeModalHeader heading="Discover pipes" />"`,
		);
	});

	it('should not detect JSX elements', () => {
		const result = applyTransform(
			codemod,
			`export const HighlightText = () => <text heading="Discover pipes" />`,
		);

		expect(result).toMatchInlineSnapshot(
			`"export const HighlightText = () => <text heading="Discover pipes" />"`,
		);
	});

	it('should not remove used theme imports', () => {
		const result = applyTransform(
			codemod,
			`import { elevation as AkElevations, colors } from '@atlaskit/theme';

export const Unlinked = styled.span\`color: \${colors.N800};\`;

export const Card = styled.div\`
  position: absolute;
  \${props => (props.isElevated ? AkElevations.e300 : AkElevations.e100)};
\`;
`,
		);

		expect(result).toMatchInlineSnapshot(`
		      "import { elevation as AkElevations, colors } from '@atlaskit/theme';

		      export const Unlinked = styled.span\`color: \${colors.N800};\`;

		      export const Card = styled.div\`
		        position: absolute;
		        \${props => (props.isElevated ? AkElevations.e300 : AkElevations.e100)};
		      \`;"
	    `);
	});

	describe('when handling aliased imports', () => {
		it('handle aliased color entrypoint usage with empty args', () => {
			const result = applyTransform(
				codemod,
				`
import { backgroundHover as foobar } from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${foobar()};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { N30 } from '@atlaskit/theme/colors';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", N30)};
			\`;"
		`);
		});

		it('handle aliased color entrypoint usage with identifier usage', () => {
			const result = applyTransform(
				codemod,
				`
import { backgroundHover as foobar } from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${foobar};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { N30 } from '@atlaskit/theme/colors';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", N30)};
			\`;"
		`);
		});

		it('handle aliased color entrypoint usage with namespace specifier expression', () => {
			const result = applyTransform(
				codemod,
				`
import * as colors from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${colors.backgroundHover};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import * as colors from '@atlaskit/theme/colors';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", colors.N30)};
			\`;"
		`);
		});
	});

	describe('when handling member expressions', () => {
		it('should perform complete replacement if legacy theming `themed()` detected', () => {
			const result = applyTransform(
				codemod,
				`
import { colors } from '@atlaskit/theme';

const Foo = (props) => css\`
  background: \${colors.background};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { colors } from '@atlaskit/theme';

			const Foo = (props) => css\`
			  background: \${token("elevation.surface", colors.N0)};
			\`;"
		`);
		});

		it('should not transform member expressions not matching imported alias', () => {
			const result = applyTransform(
				codemod,
				`
import * as colors from '@atlaskit/theme/colors';
const foobar = { text: 'foo' }
console.log(foobar.text)
`,
			);

			expect(result).toMatchInlineSnapshot(`
			        "import * as colors from '@atlaskit/theme/colors';
			        const foobar = { text: 'foo' }
			        console.log(foobar.text)"
		      `);
		});

		it('should not transform member expressions (with function invocation) not matching imported alias', () => {
			const result = applyTransform(
				codemod,
				`
import * as colors from '@atlaskit/theme/colors';
const foobar = { text: 'foo' }
console.log(foobar.text({ do: 'boo' }));
`,
			);

			expect(result).toMatchInlineSnapshot(`
			        "import * as colors from '@atlaskit/theme/colors';
			        const foobar = { text: 'foo' }
			        console.log(foobar.text({ do: 'boo' }));"
		      `);
		});

		it('should perform static replacement if legacy theming is not `themed()` detected', () => {
			const result = applyTransform(
				codemod,
				`
import { colors } from '@atlaskit/theme';

const Foo = css\`
  background-color: \${colors.backgroundHover()};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { colors } from '@atlaskit/theme';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", colors.N30)};
			\`;"
		`);
		});

		it('legacy theming detected via argument usage', () => {
			const result = applyTransform(
				codemod,
				`
import { colors } from '@atlaskit/theme';

const Foo = (props) => css\`
  background: \${colors.background(props)};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { colors } from '@atlaskit/theme';

			const Foo = (props) => css\`
			  background: \${token("elevation.surface", colors.N0)};
			\`;"
		`);
		});

		it('should correctly replace mixins wrapped in a token', () => {
			const result = applyTransform(
				codemod,
				`
import { token } from '@atlaskit/tokens';
import { colors } from '@atlaskit/theme';

const Foo = (props) => css\`
  background-color: \${token('color.background.danger', colors.backgroundHover(props))};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from '@atlaskit/tokens';
			import { colors } from '@atlaskit/theme';

			const Foo = (props) => css\`
			  background-color: \${token("color.background.danger", colors.N30)};
			\`;"
		`);
		});

		it('should correctly replace static mixins wrapped in a token', () => {
			const result = applyTransform(
				codemod,
				`
import { token } from '@atlaskit/tokens';
import { colors } from '@atlaskit/theme';

const Foo = css\`
  background-color: \${token('color.background.neutral.subtle.hovered', colors.backgroundHover())};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			              "import { token } from '@atlaskit/tokens';
			              import { colors } from '@atlaskit/theme';

			              const Foo = css\`
			                background-color: \${token('color.background.neutral.subtle.hovered', colors.N30)};
			              \`;"
		          `);
		});

		it('should only remove theme imports if no other specifiers are in use', () => {
			const result = applyTransform(
				codemod,
				`
import { token } from '@atlaskit/tokens';
import { colors, elevations } from '@atlaskit/theme';

const Foo = css\`
  background-color: \${token('color.background.neutral.subtle.hovered', colors.backgroundHover())};
  \${elevations.e100};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			              "import { token } from '@atlaskit/tokens';
			              import { colors, elevations } from '@atlaskit/theme';

			              const Foo = css\`
			                background-color: \${token('color.background.neutral.subtle.hovered', colors.N30)};
			                \${elevations.e100};
			              \`;"
		          `);
		});

		it('should only remove named theme imports if no other specifiers are in use', () => {
			const result = applyTransform(
				codemod,
				`
import { colors, elevations } from '@atlaskit/theme';

const Foo = css\`
  background-color: \${colors.backgroundHover()};
  color: \${colors.N0};
  \${elevations.e100};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import { colors, elevations } from '@atlaskit/theme';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", colors.N30)};
			  color: \${colors.N0};
			  \${elevations.e100};
			\`;"
		`);
		});

		it('should only remove named & aliased theme imports if no other specifiers are in use', () => {
			const result = applyTransform(
				codemod,
				`
import * as colors from '@atlaskit/theme/colors';

const Foo = css\`
  background-color: \${colors.backgroundHover()};
  color: \${colors.N0};
\`;`,
			);

			expect(result).toMatchInlineSnapshot(`
			"import { token } from "@atlaskit/tokens";
			import * as colors from '@atlaskit/theme/colors';

			const Foo = css\`
			  background-color: \${token("color.background.neutral.hovered", colors.N30)};
			  color: \${colors.N0};
			\`;"
		`);
		});

		it('should not detect object properties', () => {
			const result = applyTransform(
				codemod,
				`
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const HighlightButton = {
  subtle: {
    background: {
      default: { light: colors.DN30, dark: colors.DN30 },
      hover: { light: colors.DN60, dark: colors.DN60 },
      selected: { light: colors.DN10, dark: colors.DN10 },
    },
  },
};
`,
			);

			expect(result).toMatchInlineSnapshot(`
			        "import * as colors from '@atlaskit/theme/colors';
			        import { token } from '@atlaskit/tokens';

			        export const HighlightButton = {
			          subtle: {
			            background: {
			              default: { light: colors.DN30, dark: colors.DN30 },
			              hover: { light: colors.DN60, dark: colors.DN60 },
			              selected: { light: colors.DN10, dark: colors.DN10 },
			            },
			          },
			        };"
		      `);
		});
	});
});
