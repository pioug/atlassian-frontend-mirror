import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Motion',
			description:
				'A motion primitive that can be used to animate the entry and exit of components. The recommended way to apply entry and exit animations in @atlaskit/motion. Wrap with ExitingPersistence to enable exit animations when elements are removed from the DOM.',
			status: 'early-access',
			import: {
				name: 'Motion',
				package: '@atlaskit/motion',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use the Motion primitive as the recommended way to apply entry and exit animations',
				'Wrap with ExitingPersistence to enable exit animations when elements are removed from the DOM',
				'Pass pre-defined motion tokens to enteringAnimation and exitingAnimation for the simplest setup',
				'Use enteringAnimationXcss and exitingAnimationXcss with cssMap styles for full control over animation properties',
				'Multiple keyframes can be composed by joining them in animationName (e.g. combining scale and fade)',
				'Works with any React content including ADS Primitives — no render-prop pattern required',
				'Use the appear prop on ExitingPersistence to also trigger the entering animation on first mount',
			],
			accessibilityGuidelines: [
				"Always respect the user's reduced-motion preference — use isReducedMotion() or useIsReducedMotion() to conditionally disable animations",
				'Every motion component and custom animation should respect prefers-reduced-motion',
			],
			examples: [
				{
					name: 'Motion with tokens',
					description:
						'The simplest way to use the Motion primitive is with pre-defined motion tokens. Pass a motion token to enteringAnimation and exitingAnimation to apply a paired entering and exiting animation.',
					source: path.resolve(__dirname, './examples/ai/motion-primitive.tsx'),
				},
				{
					name: 'Motion with custom animation tokens',
					description:
						'For more control, use enteringAnimationXcss and exitingAnimationXcss with cssMap styles that set animationName, animationDuration, and animationTimingFunction using motion tokens.',
					source: path.resolve(__dirname, './examples/ai/motion-primitive-custom.tsx'),
				},
				{
					name: 'Motion with custom CSS keyframes',
					description:
						'For animations not covered by the built-in keyframe tokens, define your own CSS keyframes using keyframes() from @compiled/react and reference them directly in the animationName property of a cssMap style.',
					source: path.resolve(__dirname, './examples/ai/motion-primitive-custom-keyframe.tsx'),
				},
			],
			keywords: ['motion', 'animation', 'enter', 'exit', 'transition', 'primitive', 'fade', 'css'],
			categories: ['animation'],
		},
		{
			name: 'ExitingPersistence',
			description:
				'Keeps elements mounted and plays their exit animation before they are removed from the DOM. Without it, elements are removed immediately and no exit animation plays. Works with both the Motion primitive and legacy entering-motion components.',
			status: 'general-availability',
			import: {
				name: 'ExitingPersistence',
				package: '@atlaskit/motion',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Wrap motion elements with ExitingPersistence to enable exit animations when elements are removed from the DOM',
				'Set the appear prop to also trigger the entering animation when the component first mounts',
				'Use exitThenEnter prop to make elements exit before new ones enter (sequential transition)',
				'All direct children must have a unique key prop for ExitingPersistence to track additions and removals',
				'Works with both the recommended Motion primitive and legacy FadeIn, SlideIn, ZoomIn, ShrinkOut components',
			],
			examples: [
				{
					name: 'Single element',
					description:
						'ExitingPersistence keeps a single element mounted while its exit animation plays before it is removed from the DOM.',
					source: path.resolve(__dirname, './examples/ai/exiting-persistence.tsx'),
				},
			],
			keywords: ['motion', 'animation', 'exit', 'persistence', 'unmount', 'transition', 'fade'],
			categories: ['animation'],
		},
		{
			name: 'StaggeredEntrance',
			description:
				'Staggers the entering animation of its child motion elements in sequence, creating a cascading effect. Works with both the Motion primitive and legacy entering-motion components.',
			status: 'general-availability',
			import: {
				name: 'StaggeredEntrance',
				package: '@atlaskit/motion',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Wrap entering motion elements with StaggeredEntrance to create a cascading stagger effect',
				'All entering motion components must be direct descendants of StaggeredEntrance',
				'Use the columns prop to specify a fixed grid layout, or "responsive" to calculate dynamically on the client',
				'Use the delayStep prop to control how long each element group is staggered (defaults to 50ms)',
				'Stagger delay uses a logarithmic scale so large lists do not feel excessively slow',
				'Setting columns to a fixed number avoids elements being invisible before JavaScript executes (SSR-safe)',
			],
			examples: [
				{
					name: 'List of elements',
					description:
						'StaggeredEntrance staggers the entering animation of a list of elements in sequence.',
					source: path.resolve(__dirname, './examples/ai/staggered-entrance-list.tsx'),
				},
			],
			keywords: ['motion', 'animation', 'stagger', 'entrance', 'list', 'grid', 'cascade', 'delay'],
			categories: ['animation'],
		},
	],
};

export default documentation;
