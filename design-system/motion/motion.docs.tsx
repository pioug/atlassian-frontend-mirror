import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/motion',
		packagePath: path.resolve(__dirname),
		packageJson: require('./package.json'),
		overview:
			'Utilities for applying entry and exit animations. The Motion primitive is the recommended way to animate an element in or out, and the useMotion hook does the same without rendering a wrapper element. Pair either with ExitingPersistence to play exit animations before removal, and StaggeredEntrance to cascade a group. Motion tokens supply the durations, easings, and keyframes so animation stays consistent across products.',
	},
	components: [
		{
			name: 'Motion',
			description:
				'A motion primitive that can be used to animate the entry and exit of components. The recommended way to apply entry and exit animations in @atlaskit/motion. Wrap with ExitingPersistence to enable exit animations when elements are removed from the DOM.',
			status: 'early-access',
			import: {
				name: 'Motion',
				package: '@atlaskit/motion/motion',
				type: 'default',
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
				'The Motion primitive renders a wrapper div. If that wrapper would break layout, semantics, or an attribute a parent selector depends on, use the useMotion hook instead to animate an element you already render',
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
				'Motion helper that keeps elements mounted and plays their exit animation before they are removed from the DOM. Without it, elements are removed immediately and no exit animation plays. Works with both the Motion primitive and legacy entering-motion components.',
			status: 'general-availability',
			import: {
				name: 'ExitingPersistence',
				package: '@atlaskit/motion/exiting-persistence',
				type: 'default',
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
				'Motion helper that staggers the entering animation of its child motion elements in sequence, creating a cascading effect. Works with both the Motion primitive and legacy entering-motion components.',
			status: 'general-availability',
			import: {
				name: 'StaggeredEntrance',
				package: '@atlaskit/motion/staggered-entrance',
				type: 'default',
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
	hooks: [
		{
			name: 'useMotion',
			description:
				'A hook form of the Motion primitive that runs the same entry and exit animation lifecycle but renders no markup of its own. It returns { state, ref, reanimate }: state is the current point in the animation lifecycle, which the consumer maps to their own animation styles, and ref must be attached to the animated element. Use it instead of the Motion primitive when its wrapper div would break layout (a CSS grid or flex slot), break semantics (a ul/li or table/tr pairing), or drop an attribute a parent selector depends on. The Motion primitive is built on this hook and is not deprecated. Wrap with ExitingPersistence to enable exit animations.',
			status: 'early-access',
			import: {
				name: 'useMotion',
				package: '@atlaskit/motion/use-motion',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			parameters: [
				{
					name: 'props',
					type: '{ initialState?: MotionState; onFinish?: (state: Transition) => void }',
					description:
						'Optional. `initialState` overrides the state the machine starts in — use `visible` to render at rest with no entry animation, or `hidden` to stay mounted and hidden until `reanimate` is called. `onFinish` is called with `entering` or `exiting` when the matching animation completes, and with `entering` immediately on mount when the element is not appearing.',
					isOptional: true,
				},
			],
			returns: {
				type: '{ state: MotionState; ref: (node: T | null) => void; reanimate: (value: Reanimate) => void }',
				description:
					'`state` is the current point in the animation lifecycle — one of `init` (mounted, waiting on a stagger delay), `entering`, `visible` (at rest), `exiting` (still mounted), or `hidden` (animated out but still mounted) — and the consumer maps it to their own animation styles. `ref` must be attached to the animated element; it measures the animation duration so exit timing, `onFinish`, and removal by `ExitingPersistence` work, and it receives the staggered delay. `reanimate` replays the animation imperatively with `Reanimate.enter`, `Reanimate.exit`, or `Reanimate.exit_then_enter`.',
			},
			usageGuidelines: [
				'Prefer the Motion primitive by default — reach for useMotion only when an extra wrapper element would break layout, semantics, or an attribute a parent selector depends on',
				'The hook does not return styles. It returns the current state, and the consumer writes the animation CSS for each state and selects it by state — either with the Compiled css prop (css={[state === "entering" && styles.entering]}) or by passing cssMap styles through cx into className',
				'state is one of init, entering, visible, exiting, or hidden',
				'Attach the returned ref to the animated element — it is used to measure the animation duration so the exit animation completes before ExitingPersistence removes the element and before onFinish is called, and to receive a staggered delay',
				'Style the init and hidden states as not visible (for example visibility: hidden), otherwise the element flashes into view before its entry animation starts and stays visible after being animated out',
				'Wrap the conditionally rendered child in ExitingPersistence with a unique key so its exit animation plays before it is removed from the DOM, and set appear to also animate on first mount',
				'Use initialState to start the machine in visible (rendered at rest with no entry animation) or hidden (mounted and hidden until reanimate is called)',
				'Use reanimate to replay animations imperatively: Reanimate.enter, Reanimate.exit (settles in hidden without unmounting), or Reanimate.exit_then_enter',
				'onFinish is called with entering or exiting when the matching animation completes',
				'With StaggeredEntrance, render each animated element as its own component so each useMotion call receives its own delay',
				'The consuming component must use the Compiled jsx pragma to apply cssMap styles via the css prop',
			],
			accessibilityGuidelines: [
				'When reduced motion is preferred the hook settles its state machine immediately rather than waiting out the animation duration, so onFinish still fires and ExitingPersistence still removes the element promptly',
				'The hook does not disable your animation styles — because the consumer owns the animation CSS, you must add @media (prefers-reduced-motion: reduce) to your own styles to turn them off. This differs from the Motion primitive, which handles reduced motion for you',
				'Use isReducedMotion() or useIsReducedMotion() when you need to branch on the preference in JavaScript rather than CSS',
			],
			// Note: `hookToMCP` caps generated hook examples at the first 3, so the most
			// broadly useful examples are listed first.
			examples: [
				{
					name: 'useMotion with tokens',
					description:
						'A motion token carries the animation name, duration, and easing together, so it can be assigned to the animation shorthand for the entering and exiting states. The state returned by the hook selects which style applies, and the ref is attached to the element being animated — no extra wrapper element is created.',
					source: path.resolve(__dirname, './examples/ai/use-motion.tsx'),
				},
				{
					name: 'useMotion with custom animation tokens',
					description:
						'For more control, build the animation from separate tokens — animationName with keyframe tokens, plus animationDuration and animationTimingFunction — and select them by state. Multiple keyframes can be composed by joining them in animationName (for example combining scale and fade).',
					source: path.resolve(__dirname, './examples/ai/use-motion-custom.tsx'),
				},
				{
					name: 'useMotion with staggered entrance',
					description:
						'Render each animated element as its own component so each useMotion call can read its stagger delay from the surrounding StaggeredEntrance. Each element applies its own state-derived styles, so no wrapper element is added. The init state must be styled as not visible so elements do not appear before their delay elapses.',
					source: path.resolve(__dirname, './examples/ai/use-motion-staggered.tsx'),
				},
				{
					name: 'useMotion with custom CSS keyframes',
					description:
						'For animations not covered by the built-in keyframe tokens, define your own CSS keyframes using keyframes() from @compiled/react and reference them in the animationName property of a cssMap style, keeping the duration and easing from motion tokens.',
					source: path.resolve(__dirname, './examples/ai/use-motion-custom-keyframe.tsx'),
				},
			],
			keywords: [
				'motion',
				'animation',
				'hook',
				'usemotion',
				'state',
				'state machine',
				'reanimate',
				'no wrapper',
				'enter',
				'exit',
				'transition',
				'fade',
				'stagger',
				'staggered',
			],
			categories: ['animation', 'hooks'],
		},
	],
};

export default documentation;
