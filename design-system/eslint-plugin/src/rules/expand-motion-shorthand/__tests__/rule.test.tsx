import { outdent } from 'outdent';

// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('expand-motion-shorthand', rule, {
	valid: [
		{
			name: 'transitionDuration: already using sub-property, not shorthand',
			code: outdent`
				const styles = css({
					transitionDuration: '200ms',
				});
			`,
		},
		{
			name: "transition: 'none' keyword value — skip",
			code: outdent`
				const styles = css({
					transition: 'none',
				});
			`,
		},
		{
			name: 'transition: variable reference — skip',
			code: outdent`
				const styles = css({
					transition: someVariable,
				});
			`,
		},
		{
			name: 'transition: token() call — skip',
			code: outdent`
				const styles = css({
					transition: token('motion.duration.medium', '200ms'),
				});
			`,
		},
	],
	invalid: [
		{
			name: "transition: 'opacity 200ms ease-in-out 0ms' → expanded sub-properties",
			code: outdent`
				const styles = css({
					transition: 'opacity 200ms ease-in-out 0ms',
				});
			`,
			output: outdent`
				const styles = css({
					transitionProperty: 'opacity',
					transitionDuration: '200ms',
					transitionTimingFunction: 'ease-in-out',
					transitionDelay: '0ms',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: "transition: 'all 150ms ease' → expanded sub-properties",
			code: outdent`
				const styles = css({
					transition: 'all 150ms ease',
				});
			`,
			output: outdent`
				const styles = css({
					transitionProperty: 'all',
					transitionDuration: '150ms',
					transitionTimingFunction: 'ease',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: "transition: 'opacity 0 ease' — bare 0 is a valid duration, not the property",
			code: outdent`
				const styles = css({
					transition: 'opacity 0 ease',
				});
			`,
			output: outdent`
				const styles = css({
					transitionProperty: 'opacity',
					transitionDuration: '0',
					transitionTimingFunction: 'ease',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: "animation: 'fadeIn 200ms ease-in-out 0ms 1 normal forwards running' → expanded sub-properties",
			code: outdent`
				const styles = css({
					animation: 'fadeIn 200ms ease-in-out 0ms 1 normal forwards running',
				});
			`,
			output: outdent`
				const styles = css({
					animationName: 'fadeIn',
					animationDuration: '200ms',
					animationTimingFunction: 'ease-in-out',
					animationDelay: '0ms',
					animationIterationCount: '1',
					animationDirection: 'normal',
					animationFillMode: 'forwards',
					animationPlayState: 'running',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: 'transition: cubic-bezier timing function — commas inside function do not trigger multi-value',
			code: outdent`
				const styles = {
					transition: 'opacity 200ms cubic-bezier(0.4, 0, 0, 1)',
				};
			`,
			output: outdent`
				const styles = {
					transitionProperty: 'opacity',
					transitionDuration: '200ms',
					transitionTimingFunction: 'cubic-bezier(0.4, 0, 0, 1)',
				};
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: "transition: multi-value 'opacity 200ms ease, transform 150ms linear' → autofix to combined sub-properties",
			code: outdent`
				const styles = css({
					transition: 'opacity 200ms ease, transform 150ms linear',
				});
			`,
			output: outdent`
				const styles = css({
					transitionProperty: 'opacity, transform',
					transitionDuration: '200ms, 150ms',
					transitionTimingFunction: 'ease, linear',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: "animation: multi-value 'fadeIn 200ms, pulse 400ms' → autofix to combined sub-properties",
			code: outdent`
				const styles = css({
					animation: 'fadeIn 200ms, pulse 400ms',
				});
			`,
			output: outdent`
				const styles = css({
					animationName: 'fadeIn, pulse',
					animationDuration: '200ms, 400ms',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
		{
			name: 'transition: in css({}) context',
			code: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transition: 'color 300ms linear',
				});
			`,
			output: outdent`
				import { css } from '@compiled/react';
				const styles = css({
					transitionProperty: 'color',
					transitionDuration: '300ms',
					transitionTimingFunction: 'linear',
				});
			`,
			errors: [{ messageId: 'expandTransitionShorthand' }],
		},
	],
});
