import React, {
	createContext,
	type ElementType,
	PureComponent,
	type ReactNode,
	startTransition,
} from 'react';

import memoizeOne from 'memoize-one';

import noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';

import Blanket from '../styled/blanket';

import { Fade } from './animation';

export type TargetRef = (element: HTMLElement | null | undefined) => void;
export type GetTargetRef = (
	/**
	 * The `name` prop passed to the corresponding `SpotlightTarget`
	 *
	 * This is used as a key into the `targets` map owned by `SpotlightManager`
	 * because the `SpotlightManager` stores the target nodes for
	 * descendant `SpotlightTarget` instances.
	 */
	name: string,
) => TargetRef;

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext<
	GetTargetRef | undefined
>(undefined);

const SpotlightContext = createContext<{
	opened: () => void;
	closed: () => void;
	targets: {
		[key: string]: HTMLElement | undefined;
	};
}>({
	opened: noop,
	closed: noop,
	targets: {},
});

const { Consumer: SpotlightStateConsumer, Provider: SpotlightStateProvider } = SpotlightContext;

export { TargetConsumer };

export { SpotlightContext, SpotlightStateConsumer as SpotlightConsumer };

interface SpotlightManagerProps {
	/**
	 * Boolean prop for toggling blanket transparency.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	blanketIsTinted?: boolean;
	/**
	 * Typically the app, or a section of the app.
	 */
	children: ReactNode;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated
	 * Component is deprecated and will be removed in the future.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: ElementType;
	/**
	 * Handler function to be called when the blanket is clicked.
	 */
	onBlanketClicked?: () => void;
}

const Container = ({
	component: Wrapper,
	children,
}: {
	component: ElementType;
	children: ReactNode;
}) => <Wrapper>{children}</Wrapper>;

/**
 * __Spotlight manager__
 *
 * A spotlight manager manages the visibility of spotlights used to introduce new features to users through focused messages or multi-step tours.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightManager extends PureComponent<
	SpotlightManagerProps,
	{
		spotlightCount: number;
		targets: { [key: string]: HTMLElement | void };
	}
> {
	static defaultProps = {
		blanketIsTinted: true,
	};

	componentDidMount() {
		if (
			typeof process !== 'undefined' &&
			process.env.NODE_ENV !== 'production' &&
			!process.env.CI
		) {
			if (this.props.component) {
				// eslint-disable-next-line no-console
				console.warn(
					`Atlaskit: The SpotlightManager 'component' prop is deprecated. Please wrap the SpotlightManager in the component instead.`,
				);
			}
		}
	}

	state = {
		spotlightCount: 0,
		targets: {},
	};

	/*
	 * When enabling React Streaming in Confluence, a
	 * "This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering"
	 * error happens.
	 * This is to fix this error by wrapping the state update in startTransition as suggested by React: https://react.dev/errors/421?invariant=421
	 */
	getTargetRef = fg('platform_fix_component_state_update_for_suspense')
		? (name: string) => (element: HTMLElement | null | undefined) => {
				startTransition(() => {
					this.setState((state) => ({
						targets: {
							...state.targets,
							[name]: element || undefined,
						},
					}));
				});
			}
		: (name: string) => (element: HTMLElement | null | undefined) => {
				this.setState((state) => ({
					targets: {
						...state.targets,
						[name]: element || undefined,
					},
				}));
			};

	spotlightOpen = () => {
		this.setState((state) => ({ spotlightCount: state.spotlightCount + 1 }));
	};

	spotlightClose = () => {
		this.setState((state) => ({ spotlightCount: state.spotlightCount - 1 }));
	};

	getStateProviderValue = memoizeOne((targets) => ({
		opened: this.spotlightOpen,
		closed: this.spotlightClose,
		targets,
	}));

	render() {
		const { blanketIsTinted, children, component: Tag, onBlanketClicked } = this.props;
		return (
			<SpotlightStateProvider value={this.getStateProviderValue(this.state.targets)}>
				<TargetProvider value={this.getTargetRef}>
					<Container component={Tag || React.Fragment}>
						<Fade hasEntered={this.state.spotlightCount > 0}>
							{(animationStyles) => (
								<Portal zIndex={700}>
									<Blanket
										/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */
										style={animationStyles}
										isTinted={blanketIsTinted}
										onBlanketClicked={onBlanketClicked}
									/>
								</Portal>
							)}
						</Fade>
						{children}
					</Container>
				</TargetProvider>
			</SpotlightStateProvider>
		);
	}
}
