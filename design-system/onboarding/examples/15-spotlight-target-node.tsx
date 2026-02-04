import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { ExitingPersistence, SlideIn } from '@atlaskit/motion';
import { Spotlight, SpotlightManager, SpotlightTransition } from '@atlaskit/onboarding';
import { Stack } from '@atlaskit/primitives/compiled';

import { Highlight } from './styled';

interface State {
	drawerIsVisible: boolean;
	spotlightIsVisible: boolean;
}

const targetElementStyles = cssMap({
	root: {
		width: '240px',
	},
});

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class SpotlightNodeExample extends Component<Object, State> {
	drawer: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();
	state = { drawerIsVisible: false, spotlightIsVisible: false };

	showDrawer = (): void => {
		this.setState({ drawerIsVisible: true });
	};

	hideDrawer = (): void => {
		this.setState({ drawerIsVisible: false });
	};

	toggleDrawer = (): void => {
		if (this.state.drawerIsVisible) {
			this.hideDrawer();
		} else {
			this.showDrawer();
		}
	};

	showSpotlight = (): void => {
		this.setState({ spotlightIsVisible: true });
	};

	hideSpotlight = (): void => {
		this.setState({ spotlightIsVisible: false });
	};

	render(): React.JSX.Element {
		const { drawerIsVisible, spotlightIsVisible } = this.state;
		const duration = 300;
		return (
			<SpotlightManager>
				<Stack alignInline="start" space="space.200">
					<p>
						Use <code>targetNode</code> when you can&apos;t wrap the target in a{' '}
						<code>{'<SpotlightTarget />'}</code>. For example you need to wait for the node to be
						present in the DOM.
					</p>

					<button type="button" onClick={this.toggleDrawer}>
						{drawerIsVisible ? 'Close' : 'Open'}
					</button>

					<ExitingPersistence appear>
						{drawerIsVisible && (
							<SlideIn
								enterFrom="left"
								onFinish={(state) => {
									if (state === 'entering') {
										window.setTimeout(this.showSpotlight, duration);
									}

									if (state === 'exiting') {
										this.hideSpotlight();
										return;
									}
								}}
							>
								{({ ref, className, style }) => (
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-classname-prop
									<div ref={ref} style={style} className={className}>
										<Highlight ref={this.drawer} color="green">
											<Stack space="space.100" xcss={targetElementStyles.root}>
												<Heading size="medium">Animated Element</Heading>
												<Lorem count={2} />
											</Stack>
										</Highlight>
									</div>
								)}
							</SlideIn>
						)}
					</ExitingPersistence>
				</Stack>

				<SpotlightTransition>
					{spotlightIsVisible && this.drawer.current ? (
						<Spotlight
							actions={[
								{
									onClick: this.hideSpotlight,
									text: 'Done',
								},
							]}
							dialogPlacement="right middle"
							heading="Waits for node availability"
							targetNode={this.drawer.current}
						>
							<Lorem count={1} />
						</Spotlight>
					) : null}
				</SpotlightTransition>
			</SpotlightManager>
		);
	}
}
