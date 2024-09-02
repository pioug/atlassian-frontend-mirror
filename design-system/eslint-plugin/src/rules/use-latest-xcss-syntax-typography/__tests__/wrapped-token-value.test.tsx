import outdent from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-latest-xcss-syntax-typography', rule, {
	valid: [
		// ignores token values that are not wrapped
		outdent`
			import { xcss } from '@atlaskit/primitives';

			const styles = xcss({
				font: 'font.body.large',
				fontWeight: 'font.weight.bold',
				fontFamily: 'font.family.code',
			});
		`,
		// ignores non-typography properties
		outdent`
			import { xcss } from '@atlaskit/primitives';
			import { token } from '@atlaskit/tokens';

			const styles = xcss({
				marginTop: token('font.weight.bold'),
			});
		`,
	],
	invalid: [
		// raises a violation and autofixes for wrapped font tokens for typography properties using identifier syntax
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';
				import { token } from '@atlaskit/tokens';

				const styles = xcss({
					font: token('font.body.large'),
					fontWeight: token('font.weight.bold'),
					fontFamily: token('font.family.code'),
				});
			`,
			errors: [
				{ messageId: 'noWrappedTokenTypographyValues' },
				{ messageId: 'noWrappedTokenTypographyValues' },
				{ messageId: 'noWrappedTokenTypographyValues' },
			],
			output: outdent`
				import { xcss } from '@atlaskit/primitives';
				import { token } from '@atlaskit/tokens';

				const styles = xcss({
					font: 'font.body.large',
					fontWeight: 'font.weight.bold',
					fontFamily: 'font.family.code',
				});
			`,
		},
		// raises a violation and autofixes for wrapped font tokens for typography properties using literal syntax with camel case
		{
			code: outdent`
				import { xcss } from '@atlaskit/primitives';
				import { token } from '@atlaskit/tokens';

				const styles = xcss({
					'font': token('font.body.large'),
					'fontWeight': token('font.weight.bold'),
					'fontFamily': token('font.family.code'),
				});
			`,
			errors: [
				{ messageId: 'noWrappedTokenTypographyValues' },
				{ messageId: 'noWrappedTokenTypographyValues' },
				{ messageId: 'noWrappedTokenTypographyValues' },
			],
			output: outdent`
				import { xcss } from '@atlaskit/primitives';
				import { token } from '@atlaskit/tokens';

				const styles = xcss({
					'font': 'font.body.large',
					'fontWeight': 'font.weight.bold',
					'fontFamily': 'font.family.code',
				});
			`,
		},
		// raises a violation and autofixes for wrapped font tokens with fallbacks for typography properties
		{
			code: outdent`
			import { xcss } from '@atlaskit/primitives';
			import { fontFallback } from '@atlaskit/theme';
			import { token } from '@atlaskit/tokens';

			const styles = xcss({
				font: token('font.body', fontFallback.body.medium),
				'fontWeight': token('font.weight.medium', 450),
			});
		`,
			errors: [
				{ messageId: 'noWrappedTokenTypographyValues' },
				{ messageId: 'noWrappedTokenTypographyValues' },
			],
			output: outdent`
				import { xcss } from '@atlaskit/primitives';
				import { fontFallback } from '@atlaskit/theme';
				import { token } from '@atlaskit/tokens';

				const styles = xcss({
					font: 'font.body',
					'fontWeight': 'font.weight.medium',
				});
			`,
		},
	],
});
