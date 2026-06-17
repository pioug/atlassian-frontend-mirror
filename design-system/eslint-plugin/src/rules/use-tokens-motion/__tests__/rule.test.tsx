import { outdent } from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-tokens-motion', rule, {
	valid: [
		{
			name: 'already using token() for transitionDuration',
			code: outdent`
				const styles = {
					transitionDuration: token('motion.duration.medium', '200ms'),
				};
			`,
		},
		{
			name: 'value is a function call (not token) — skip',
			code: outdent`
				import { css } from '@compiled/react';
				import { getDuration } from 'somewhere';
				const styles = css({
					transitionDuration: getDuration(),
				});
			`,
		},
		{
			name: 'template literal with interpolation — skip',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transitionDuration: \`\${duration}ms\`,
				});
			`,
		},
		{
			name: 'already using token() for transitionTimingFunction',
			code: outdent`
				const styles = {
					transitionTimingFunction: token('motion.easing.inout.bold', 'cubic-bezier(0.4, 0, 0, 1)'),
				};
			`,
		},
		{
			name: 'already using token() for animationDuration',
			code: outdent`
				const styles = {
					animationDuration: token('motion.duration.xshort', '100ms'),
				};
			`,
		},
		{
			name: 'already using token() for animationTimingFunction',
			code: outdent`
				const styles = {
					animationTimingFunction: token('motion.easing.out.bold', 'cubic-bezier(0, 0.4, 0, 1)'),
				};
			`,
		},
		{
			name: 'template literal with interpolation for easing — skip',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transitionTimingFunction: \`\${easing}\`,
				});
			`,
		},
		{
			name: 'linear() easing — skip (spring token is experimental)',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'linear(0, 0.021, 0.5, 1)',
				};
			`,
		},
		{
			name: 'transitionTimingFunction: step-start — not flagged (no cubic-bezier equivalent)',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'step-start',
				};
			`,
		},
		{
			name: 'multi-value transitionDuration with non-exact values — skipped, no error',
			code: outdent`
				const styles = {
					transitionDuration: '300ms, 300ms',
				};
			`,
		},
	],

	invalid: [
		{
			name: 'transitionDuration: exact match 200ms, adds @atlaskit/tokens import',
			code: outdent`
				const styles = {
					transitionDuration: '200ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.medium', '200ms'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'animationDuration: seconds format 0.1s → xshort',
			code: outdent`
				const styles = {
					animationDuration: '0.1s',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					animationDuration: token('motion.duration.xshort', '0.1s'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'transitionTimingFunction: exact cubic-bezier match',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'cubic-bezier(0.4, 0, 0, 1)',
				};
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionTimingFunction: token('motion.easing.inout.bold', 'cubic-bezier(0.4, 0, 0, 1)'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'transitionDuration: exact upper bound 600ms → motion.duration.xxlong',
			code: outdent`
				const styles = {
					transitionDuration: '600ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.xxlong', '600ms'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'transitionDuration: bare number 0 → motion.duration.instant',
			code: outdent`
				const styles = {
					transitionDuration: 0,
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.instant', '0ms'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'animationTimingFunction: non-exact cubic-bezier → closest token',
			code: outdent`
				const styles = {
					animationTimingFunction: 'cubic-bezier(0.5, 0.1, 0.9, 0.7)',
				};
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					animationTimingFunction: token('motion.easing.in.practical', 'cubic-bezier(0.5, 0.1, 0.9, 0.7)'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'transitionDuration: 300ms has no exact token — warns with single nearest',
			code: outdent`
				const styles = {
					transitionDuration: '300ms',
				};
			`,
			errors: [{ messageId: 'useMotionDurationTokenSingleNearest' }],
		},

		{
			name: 'transitionDuration: 325ms equidistant → suggest both, no autofix',
			code: outdent`
				const styles = {
					transitionDuration: '325ms',
				};
			`,
			errors: [{ messageId: 'useMotionDurationTokenNearest' }],
		},

		{
			name: 'already has @atlaskit/tokens import — no duplicate import added',
			code: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: '200ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.medium', '200ms'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'no @atlaskit/tokens import — import added after last existing import',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transitionDuration: '100ms',
				});
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { css } from '@compiled/react';
				import { token } from '@atlaskit/tokens';
				const styles = css({
					transitionDuration: token('motion.duration.xshort', '100ms'),
				});
			`,
						},
					],
				},
			],
		},

		{
			name: 'ease → motion.easing.out.practical',
			code: outdent`
				const styles = { transitionTimingFunction: 'ease' };
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = { transitionTimingFunction: token('motion.easing.out.practical', 'ease') };
			`,
						},
					],
				},
			],
		},
		{
			name: 'ease-in → motion.easing.in.practical',
			code: outdent`
				const styles = { transitionTimingFunction: 'ease-in' };
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = { transitionTimingFunction: token('motion.easing.in.practical', 'ease-in') };
			`,
						},
					],
				},
			],
		},
		{
			name: 'ease-out → motion.easing.out.practical',
			code: outdent`
				const styles = { transitionTimingFunction: 'ease-out' };
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = { transitionTimingFunction: token('motion.easing.out.practical', 'ease-out') };
			`,
						},
					],
				},
			],
		},
		{
			name: 'linear keyword — warns with single nearest (no curve, no matching token)',
			code: outdent`
				const styles = { transitionTimingFunction: 'linear' };
			`,
			errors: [{ messageId: 'useMotionEasingTokenUnknown' }],
		},
		{
			name: 'transitionTimingFunction: ease-in-out → motion.easing.inout.bold (semantic mapping)',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'ease-in-out',
				};
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionTimingFunction: token('motion.easing.inout.bold', 'ease-in-out'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'transitionTimingFunction: unknown non-cubic-bezier function → report no autofix',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'steps(4, end)',
				};
			`,
			errors: [{ messageId: 'useMotionEasingTokenUnknown' }],
		},

		{
			name: 'transitionTimingFunction: cubic-bezier far from all tokens → report no autofix',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'cubic-bezier(0.1, 0.1, 0.1, 0.1)',
				};
			`,
			errors: [{ messageId: 'useMotionEasingTokenUnknown' }],
		},

		{
			name: 'animationDuration: 0ms → instant',
			code: outdent`
				const styles = {
					animationDuration: '0ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					animationDuration: token('motion.duration.instant', '0ms'),
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'works inside Compiled css()',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transitionTimingFunction: 'cubic-bezier(0.4, 1, 0.6, 1)',
				});
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { css } from '@compiled/react';
				import { token } from '@atlaskit/tokens';
				const styles = css({
					transitionTimingFunction: token('motion.easing.out.practical', 'cubic-bezier(0.4, 1, 0.6, 1)'),
				});
			`,
						},
					],
				},
			],
		},

		{
			name: 'inline JSX style — transitionDuration',
			code: outdent`
				const el = <div style={{ transitionDuration: '200ms' }} />;
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const el = <div style={{ transitionDuration: token('motion.duration.medium', '200ms') }} />;
			`,
						},
					],
				},
			],
		},

		{
			name: 'no-interpolation template literal duration — treated same as string literal',
			code: outdent`
				const styles = {
					transitionDuration: \`200ms\`,
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.medium', '200ms'),
				};
			`,
						},
					],
				},
			],
		},
		{
			name: 'no-interpolation template literal easing — treated same as string literal',
			code: outdent`
				const styles = {
					transitionTimingFunction: \`cubic-bezier(0.4, 0, 0, 1)\`,
				};
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionTimingFunction: token('motion.easing.inout.bold', 'cubic-bezier(0.4, 0, 0, 1)'),
				};
			`,
						},
					],
				},
			],
		},
		{
			name: 'transitionDuration out of range — 700ms has no exact token, warns with single nearest',
			code: outdent`
				const styles = {
					transitionDuration: '700ms',
				};
			`,
			errors: [{ messageId: 'useMotionDurationTokenSingleNearest' }],
		},

		{
			name: 'multi-value transitionDuration with exact tokens — autofix each segment',
			code: outdent`
				const styles = {
					transitionDuration: '200ms, 200ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: \`\${token('motion.duration.medium', '200ms')}, \${token('motion.duration.medium', '200ms')}\`,
				};
			`,
						},
					],
				},
			],
		},

		{
			name: 'multi-value transitionTimingFunction — autofix each cubic-bezier to a token',
			code: outdent`
				const styles = {
					transitionTimingFunction: 'cubic-bezier(0.4, 0, 0, 1), cubic-bezier(0.4, 0, 0, 1)',
				};
			`,
			errors: [
				{
					messageId: 'useMotionEasingToken',
					suggestions: [
						{
							messageId: 'useMotionEasingTokenSuggest',
							output: outdent`
				import { token } from '@atlaskit/tokens';
				const styles = {
					transitionTimingFunction: \`\${token('motion.easing.inout.bold', 'cubic-bezier(0.4, 0, 0, 1)')}, \${token('motion.easing.inout.bold', 'cubic-bezier(0.4, 0, 0, 1)')}\`,
				};
			`,
						},
					],
				},
			],
		},

		{
			name: '@atlaskit/tokens imported without token — adds token specifier to existing import',
			code: outdent`
				import { themed } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: '150ms',
				};
			`,
			errors: [
				{
					messageId: 'useMotionDurationToken',
					suggestions: [
						{
							messageId: 'useMotionDurationTokenSuggest',
							output: outdent`
				import { themed, token } from '@atlaskit/tokens';
				const styles = {
					transitionDuration: token('motion.duration.short', '150ms'),
				};
			`,
						},
					],
				},
			],
		},
	],
});
