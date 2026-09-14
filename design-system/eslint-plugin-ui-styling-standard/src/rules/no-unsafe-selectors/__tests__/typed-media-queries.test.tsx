import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('typed media queries', rule, {
	valid: [
		{
			name: 'canonical media query with a default type import',
			code: `
        import { css } from '@compiled/react';
        import type MediaAboveXs from '@atlaskit/css/at-rules/media-above-xs';

        css({
          ['@media (min-width: 30rem)' satisfies MediaAboveXs]: {},
        });
      `,
		},
		{
			name: 'canonical media queries in supported styling APIs',
			code: `
        import { css, cssMap, styled } from '@compiled/react';
        import type MediaAboveSm from '@atlaskit/css/at-rules/media-above-sm';
        import type MediaOnlyMd from '@atlaskit/css/at-rules/media-only-md';
        import { xcss } from '@atlaskit/primitives/xcss';

        css({ ['@media (min-width: 48rem)' satisfies MediaAboveSm]: {} });
        cssMap({
          base: { ['@media (min-width: 64rem) and (max-width: 89.99rem)' satisfies MediaOnlyMd]: {} },
        });
        styled.div({ ['@media (min-width: 48rem)' satisfies MediaAboveSm]: {} });
        xcss({ ['@media (min-width: 48rem)' satisfies MediaAboveSm]: {} });
      `,
		},
	],
	invalid: [
		{
			name: 'still reports restricted non-media at-rules',
			code: `
        import { css } from '@compiled/react';

        css({
          '@keyframes fade-in': {},
        });
      `,
			errors: [{ messageId: 'no-keyframes-at-rules' }],
		},
	],
});
