import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/motion',
		packagePath: __dirname,
		packageJson: require('./package.json'),
		overview:
			'Utilities for applying ADS motion. Prefer motion already owned by an ADS component and choose the smallest API combination that satisfies the task. For entry and exit behavior, keep Motion mounted and pass action="enter" or action="exit" with the corresponding semantic tokens. Do not use ExitingPersistence for new Motion implementations; it remains documented for existing integrations while its remaining use cases are validated. Use useMotion only when the Motion wrapper would break layout or semantics, and use StaggeredEntrance only when sequencing aids comprehension. Use Resizing or useResizing only when a dimension change communicates state and a transform-based or non-animated treatment would not meet the design. Prefer semantic motion tokens for the affected role and state; do not invent token names, durations, easings, or keyframes.',
	},
	components: [
		{
			name: 'Motion',
			description:
				'A motion primitive that can animate the entry and exit of components. The recommended way to apply entry and exit animations in @atlaskit/motion is to keep Motion mounted and control its lifecycle with the action prop.',
			status: 'early-access',
			import: {
				name: 'Motion',
				package: '@atlaskit/motion/entering/motion',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use motion already owned by an ADS component instead of wrapping or replacing it',
				'Use the Motion primitive as the recommended way to apply entry and exit animations',
				'Pass action="enter" or action="exit" whenever Motion needs to respond to application state, and keep Motion mounted so it can play the exit animation before rendering null',
				'Provide enteringAnimation for action="enter" and exitingAnimation for action="exit"; omit the unused animation only when the component can never perform that action',
				'Do not use ExitingPersistence for new Motion implementations; it remains available only for existing integrations while its remaining use cases are validated',
				'Prefer the complete semantic motion token for the affected role and state; inspect the full motion.<role>.* namespace so paired entry, exit, and reposition states are not missed',
				'Do not invent a motion token or reconstruct an available semantic token from base duration, easing, and keyframe tokens',
				'Use enteringAnimationXcss and exitingAnimationXcss only when no semantic motion token covers the required treatment, and compose only from published base motion tokens',
				'Multiple keyframes can be composed by joining them in animationName (e.g. combining scale and fade)',
				'Works with any React content including ADS Primitives — no render-prop pattern required',
				'The Motion primitive renders a wrapper div. If that wrapper would break layout, semantics, or an attribute a parent selector depends on, use the useMotion hook instead to animate an element you already render',
				'Keep entry and exit motion subordinate to the task, and verify the result in the browser rather than treating an import or token reference as evidence that motion occurred',
			],
			accessibilityGuidelines: [
				"Always respect the user's reduced-motion preference — use isReducedMotion() or useIsReducedMotion() to conditionally disable animations",
				'Every motion component and custom animation should respect prefers-reduced-motion',
			],
			examples: [
				{
					name: 'Motion with semantic tokens',
					description:
						'Keep Motion mounted, pass action="enter" or action="exit" from application state, and provide the corresponding semantic tokens. Motion renders null after its exit animation completes.',
					source: `${__dirname}/examples/ai/motion-primitive.tsx`,
				},
				{
					name: 'Motion with custom animation tokens',
					description:
						'For more control, use enteringAnimationXcss and exitingAnimationXcss with cssMap styles that set animationName, animationDuration, and animationTimingFunction using motion tokens.',
					source: `${__dirname}/examples/ai/motion-primitive-custom.tsx`,
				},
				{
					name: 'Motion with custom CSS keyframes',
					description:
						'For animations not covered by the built-in keyframe tokens, define your own CSS keyframes using keyframes() from @compiled/react and reference them directly in the animationName property of a cssMap style.',
					source: `${__dirname}/examples/ai/motion-primitive-custom-keyframe.tsx`,
				},
			],
			keywords: ['motion', 'animation', 'enter', 'exit', 'transition', 'primitive', 'fade', 'css'],
			categories: ['animation'],
		},
		{
			name: 'ExitingPersistence',
			description:
				'Motion helper that keeps conditionally rendered elements mounted while their exit animation plays. It remains available while its remaining use cases are validated, but it is not recommended for new Motion implementations; keep Motion mounted and use its action prop instead.',
			status: 'general-availability',
			import: {
				name: 'ExitingPersistence',
				package: '@atlaskit/motion/exiting-persistence',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Do not introduce ExitingPersistence in new Motion implementations; keep Motion mounted and control it with action="enter" or action="exit" instead',
				'Retain ExitingPersistence only in existing integrations that have not yet migrated to an internally controlled Motion lifecycle',
				'Keep ExitingPersistence mounted and conditionally render the child inside it; unmounting the persistence boundary prevents it from managing the exit',
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
					source: `${__dirname}/examples/ai/exiting-persistence.tsx`,
				},
			],
			keywords: ['motion', 'animation', 'exit', 'persistence', 'unmount', 'transition', 'fade'],
			categories: ['animation'],
		},
		{
			name: 'Resizing',
			description:
				'Animates width, height, or both when an element changes dimensions. Use it only when the size change itself communicates state and a transform-based or non-animated treatment would not meet the design. Resizing layout properties can trigger reflow and degrade frame rate, so communicate that risk, consider a safer alternative, and verify the interaction on representative low-powered devices.',
			status: 'general-availability',
			import: {
				name: 'Resizing',
				package: '@atlaskit/motion/resizing/resizing',
				type: 'named',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Prefer a transform-based or non-animated treatment when it preserves the intended behavior',
				'Use Resizing only when changing width or height communicates a meaningful state change',
				'Set dimension to width, height, or both and use published motion duration and easing tokens',
				'Attach the supplied ref to the element whose dimensions change',
				'Warn the user that width and height animation causes layout work, and suggest a safer treatment when the design permits one',
				'Test rapid repeated changes, overflow, surrounding layout, and frame rate on representative low-powered devices',
			],
			accessibilityGuidelines: [
				'Reduced-motion behavior is owned by Resizing; do not add a duplicate consumer workaround',
				'Under reduced motion the content must reach its final dimensions immediately without waiting for the transition',
				'Preserve focus, reading order, and screen-reader behavior while content changes size',
			],
			examples: [
				{
					name: 'Animate a height change',
					description:
						'Resizing animates a meaningful height change and supplies the ref that must be attached to the element being measured.',
					source: `${__dirname}/examples/ai/resizing.tsx`,
				},
			],
			keywords: [
				'motion',
				'animation',
				'resize',
				'resizing',
				'width',
				'height',
				'layout',
				'performance',
			],
			categories: ['animation'],
		},
		{
			name: 'MotionPresenceBoundary',
			description:
				"Separates a container's motion presence lifecycle from its descendants. Use it inside an animated overlay or container so motion-aware content does not inherit the container's presence state or contribute to its exit completion, while nested ExitingPersistence boundaries continue to manage their own items.",
			status: 'early-access',
			import: {
				name: 'MotionPresenceBoundary',
				package: '@atlaskit/motion/motion-presence-boundary',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Place MotionPresenceBoundary inside the component that owns the container animation and wrap the container content',
				"Use it when motion-aware descendants should not inherit an enclosing popup, modal, drawer, flag, or other container's presence state or exit completion callback",
				'Do not use it to disable descendant motion — explicit Motion components and nested ExitingPersistence boundaries retain their own lifecycle',
				'MotionPresenceBoundary does not render a DOM element, so it does not affect layout or semantics',
			],
			examples: [
				{
					name: 'Compare presence with and without a boundary',
					description:
						'A custom dropdown containing a tag, with a toggle to compare inherited and isolated presence. Enable platform-dst-motion-isolate-presence and platform-dst-motion-uplift-labels to run this example.',
					source: `${__dirname}/examples/constellation/motion-presence-boundary.tsx`,
				},
			],
			keywords: [
				'motion',
				'animation',
				'presence',
				'boundary',
				'container',
				'overlay',
				'nested',
				'exit',
			],
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
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Wrap entering motion elements with StaggeredEntrance to create a cascading stagger effect',
				'Use staggered entry only when the sequence improves comprehension; do not add it as decoration to large or frequently changing collections',
				'All entering motion components must be direct descendants of StaggeredEntrance',
				'Give every animated child a stable key so its identity is preserved across updates',
				'Use the columns prop to specify a fixed grid layout, or "responsive" to calculate dynamically on the client',
				'Use the delayStep prop to control how long each element group is staggered (defaults to 50ms)',
				'Stagger delay uses a logarithmic scale so large lists do not feel excessively slow',
				'Setting columns to a fixed number avoids elements being invisible before JavaScript executes (SSR-safe)',
				'Keep the number of animated children and total delay bounded so users are not forced to wait for content',
			],
			examples: [
				{
					name: 'List of elements',
					description:
						'StaggeredEntrance staggers the entering animation of a list of elements in sequence.',
					source: `${__dirname}/examples/ai/staggered-entrance-list.tsx`,
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
				'A hook form of the Motion primitive that runs the same entry and exit animation lifecycle but renders no markup of its own. It returns { state, ref, reanimate }: state is the current point in the animation lifecycle, which the consumer maps to their own animation styles, and ref must be attached to the animated element. Use it instead of the Motion primitive when its wrapper div would break layout (a CSS grid or flex slot), break semantics (a ul/li or table/tr pairing), or drop an attribute a parent selector depends on. The Motion primitive is built on this hook and is not deprecated.',
			status: 'early-access',
			import: {
				name: 'useMotion',
				package: '@atlaskit/motion/entering/use-motion',
				type: 'named',
				packagePath: __dirname,
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
					'`state` is the current point in the animation lifecycle — one of `init` (mounted, waiting on a stagger delay), `entering`, `visible` (at rest), `exiting` (still mounted), or `hidden` (animated out but still mounted) — and the consumer maps it to their own animation styles. `ref` must be attached to the animated element; it measures the animation duration so exit timing and `onFinish` work, and it receives the staggered delay. `reanimate` replays the animation imperatively with `Reanimate.enter`, `Reanimate.exit`, or `Reanimate.exit_then_enter`.',
			},
			usageGuidelines: [
				'Prefer the Motion primitive by default — reach for useMotion only when an extra wrapper element would break layout, semantics, or an attribute a parent selector depends on',
				'The hook does not return styles. It returns the current state, and the consumer writes the animation CSS for each state and selects it by state — either with the Compiled css prop (css={[state === "entering" && styles.entering]}) or by passing cssMap styles through cx into className',
				'state is one of init, entering, visible, exiting, or hidden',
				'Attach the returned ref to the animated element — it is used to measure the animation duration before onFinish is called and to receive a staggered delay',
				'Style the init and hidden states as not visible (for example visibility: hidden), otherwise the element flashes into view before its entry animation starts and stays visible after being animated out',
				'Keep the hook owner mounted and call reanimate with Reanimate.enter or Reanimate.exit when application state changes; do not introduce ExitingPersistence in new implementations',
				'Use initialState to start the machine in visible (rendered at rest with no entry animation) or hidden (mounted and hidden until reanimate is called)',
				'Use reanimate to replay animations imperatively: Reanimate.enter, Reanimate.exit (settles in hidden without unmounting), or Reanimate.exit_then_enter',
				'onFinish is called with entering or exiting when the matching animation completes',
				'With StaggeredEntrance, render each animated element as its own component so each useMotion call receives its own delay',
				'The consuming component must use the Compiled jsx pragma to apply cssMap styles via the css prop',
			],
			accessibilityGuidelines: [
				'When reduced motion is preferred the hook settles its state machine immediately rather than waiting out the animation duration, so onFinish still fires promptly',
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
					source: `${__dirname}/examples/ai/use-motion.tsx`,
				},
				{
					name: 'useMotion with custom animation tokens',
					description:
						'For more control, build the animation from separate tokens — animationName with keyframe tokens, plus animationDuration and animationTimingFunction — and select them by state. Multiple keyframes can be composed by joining them in animationName (for example combining scale and fade).',
					source: `${__dirname}/examples/ai/use-motion-custom.tsx`,
				},
				{
					name: 'useMotion with staggered entrance',
					description:
						'Render each animated element as its own component so each useMotion call can read its stagger delay from the surrounding StaggeredEntrance. Each element applies its own state-derived styles, so no wrapper element is added. The init state must be styled as not visible so elements do not appear before their delay elapses.',
					source: `${__dirname}/examples/ai/use-motion-staggered.tsx`,
				},
				{
					name: 'useMotion with custom CSS keyframes',
					description:
						'For animations not covered by the built-in keyframe tokens, define your own CSS keyframes using keyframes() from @compiled/react and reference them in the animationName property of a cssMap style, keeping the duration and easing from motion tokens.',
					source: `${__dirname}/examples/ai/use-motion-custom-keyframe.tsx`,
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
		{
			name: 'useResizing',
			description:
				'A hook that animates width, height, or both when an existing element changes dimensions. Prefer the Resizing component unless the hook better fits the existing element. Dimension animation causes layout work, so use it only when size communicates state and a transform-based or non-animated treatment would not meet the design.',
			status: 'general-availability',
			import: {
				name: 'useResizing',
				package: '@atlaskit/motion/use-resizing',
				type: 'named',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Prefer a transform-based or non-animated treatment when it preserves the intended behavior',
				'Use useResizing only when changing width or height communicates a meaningful state change',
				'Set dimension to width, height, or both and use published motion duration and easing tokens',
				'Attach the returned ref to the element whose dimensions change',
				'Warn the user that width and height animation causes layout work, and suggest a safer treatment when the design permits one',
				'Use onStartMotion and onFinishMotion only for behavior that must align with the resize lifecycle',
				'Test rapid repeated changes, overflow, surrounding layout, and frame rate on representative low-powered devices',
			],
			accessibilityGuidelines: [
				'Reduced-motion behavior is owned by useResizing; do not add a duplicate consumer workaround',
				'Under reduced motion the hook reaches the final dimensions immediately and calls onFinishMotion without waiting for a transition',
				'Preserve focus, reading order, and screen-reader behavior while content changes size',
			],
			examples: [
				{
					name: 'Animate an existing element height',
					description:
						'useResizing returns the ref to attach directly to an existing element whose height changes.',
					source: `${__dirname}/examples/ai/use-resizing.tsx`,
				},
			],
			keywords: [
				'motion',
				'animation',
				'hook',
				'useresizing',
				'resize',
				'width',
				'height',
				'layout',
				'performance',
			],
			categories: ['animation', 'hooks'],
		},
	],
};

export default documentation;
