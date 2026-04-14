import { tsRuleTester } from './utils/_tester';

// eslint-disable-next-line import/no-commonjs
const rule = require('../rules/enforce-compiled-migration-gate');

const parserOptions = {
	ecmaFeatures: { jsx: true },
};

describe('enforce-compiled-migration-gate', () => {
	tsRuleTester.run('enforce-compiled-migration-gate', rule, {
		valid: [
			{
				// Correctly gated with expValEquals in array syntax
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={[expValEquals('platform_editor_static_css', 'isEnabled', true) && compiledStyles]} />
					);
				`,
				parserOptions,
			},
			{
				// No css prop on a non-migration component — not our concern
				code: `
					const App = () => <SomeOtherComponent />;
				`,
				parserOptions,
			},
			{
				// css prop on a non-migration component — not our concern
				code: `
					const App = () => <SomeComponent css={compiledStyles} />;
				`,
				parserOptions,
			},
			{
				// Conditional expression with experiment gate
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={expValEquals('platform_editor_static_css', 'isEnabled', true) ? compiledStyles : undefined} />
					);
				`,
				parserOptions,
			},
		],
		invalid: [
			{
				// Missing gate entirely — bare styles
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => <StyledButton css={compiledStyles} />;
				`,
				parserOptions,
				errors: [{ messageId: 'missingGate' }],
			},
			{
				// Array syntax but no experiment gate
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => <StyledButton css={[compiledStyles]} />;
				`,
				parserOptions,
				errors: [{ messageId: 'missingGate' }],
			},
			{
				// Wrong experiment name
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={[expValEquals('some_other_experiment', 'isEnabled', true) && compiledStyles]} />
					);
				`,
				parserOptions,
				errors: [{ messageId: 'missingGate' }],
			},
			{
				// Gated with wrong function (not expValEquals)
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={[someOtherGate('platform_editor_static_css') && compiledStyles]} />
					);
				`,
				parserOptions,
				errors: [{ messageId: 'missingGate' }],
			},
			{
				// No css prop on a migration-wrapped component — likely forgot compiled styles
				code: `
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => <StyledButton />;
				`,
				parserOptions,
				errors: [{ messageId: 'missingCssProp' }],
			},
			{
				// File uses emotion @jsx pragma — css prop would be emotion, not compiled
				code: `
					/** @jsx jsx */
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={[expValEquals('platform_editor_static_css', 'isEnabled', true) && styles]} />
					);
				`,
				parserOptions,
				errors: [{ messageId: 'emotionPragma' }],
			},
			{
				// File uses emotion @jsxImportSource pragma
				code: `
					/** @jsxImportSource @emotion/react */
					import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
					const StyledButton = withCompiledMigration(Button, emotionStyles);
					const App = () => (
						<StyledButton css={[expValEquals('platform_editor_static_css', 'isEnabled', true) && styles]} />
					);
				`,
				parserOptions,
				errors: [{ messageId: 'emotionPragma' }],
			},
		],
	});
});
