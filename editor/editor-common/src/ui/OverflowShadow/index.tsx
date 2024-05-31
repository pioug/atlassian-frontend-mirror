import React from 'react';

import { ShadowObserver, shadowObserverClassNames } from './shadowObserver';

export const shadowClassNames = {
	RIGHT_SHADOW: 'right-shadow',
	LEFT_SHADOW: 'left-shadow',
};

export interface OverflowShadowProps {
	handleRef?: (ref: HTMLElement | null) => void;
	shadowClassNames?: string;
}

export interface OverflowShadowState {
	showLeftShadow: boolean;
	showRightShadow: boolean;
}

export interface OverflowShadowOptions {
	overflowSelector: string;
	// this is optimisation that can be enabled for most common cases where scroll contents top element takes up the scroll width
	useShadowObserver?: boolean;
}

export default function overflowShadow<P>(
	Component: React.ComponentType<React.PropsWithChildren<P & OverflowShadowProps>>,
	options: OverflowShadowOptions,
) {
	return class OverflowShadow extends React.Component<P, OverflowShadowState> {
		overflowContainer?: HTMLElement | null;
		container?: HTMLElement;
		shadowObserver?: ShadowObserver;
		overflowContainerWidth: number = 0;
		scrollable?: NodeList;
		diff?: number;

		state = {
			showLeftShadow: false,
			showRightShadow: false,
		};

		componentWillUnmount() {
			if (options.useShadowObserver) {
				return this.shadowObserver && this.shadowObserver.dispose();
			}

			if (this.overflowContainer) {
				this.overflowContainer.removeEventListener('scroll', this.handleScroll);
			}
			this.updateShadows();
		}

		componentDidUpdate() {
			if (!options.useShadowObserver) {
				this.updateShadows();
			}
		}

		handleScroll = (event: Event) => {
			if (
				!this.overflowContainer ||
				event.target !== this.overflowContainer ||
				options.useShadowObserver
			) {
				return;
			}
			this.updateShadows();
		};

		updateShadows = () => {
			if (options.useShadowObserver) {
				return;
			}

			this.setState((prevState) => {
				if (!this.overflowContainer) {
					return;
				}
				const diff = this.calcOverflowDiff();
				const showRightShadow = diff > 0 && diff > this.overflowContainer.scrollLeft;

				const showLeftShadow = this.showLeftShadow(this.overflowContainer);

				if (
					showLeftShadow !== prevState.showLeftShadow ||
					showRightShadow !== this.state.showRightShadow
				) {
					return {
						showLeftShadow,
						showRightShadow,
					};
				}
				return null;
			});
		};

		showLeftShadow = (overflowContainer: HTMLElement | null | undefined): boolean => {
			return !!overflowContainer && overflowContainer.scrollLeft > 0;
		};

		calcOverflowDiff = () => {
			if (!this.overflowContainer) {
				return 0;
			}

			this.diff = this.calcScrollableWidth();
			return this.diff - this.overflowContainer.offsetWidth;
		};

		calcScrollableWidth = () => {
			if (!this.scrollable && this.overflowContainer) {
				return this.overflowContainer.scrollWidth;
			}

			if (!this.scrollable) {
				return 0;
			}

			let width = 0;
			for (let i = 0; i < this.scrollable.length; i++) {
				const scrollableElement = this.scrollable[i] as HTMLElement;
				width += scrollableElement.scrollWidth;
			}

			return width;
		};

		handleContainer = (container: HTMLElement | null): void => {
			if (!container || this.container) {
				return;
			}
			this.container = container;

			this.overflowContainer = container.querySelector(options.overflowSelector) as HTMLElement;

			if (!this.overflowContainer) {
				this.overflowContainer = container;
			}

			if (options.useShadowObserver) {
				this.initShadowObserver();
				return;
			}

			this.updateShadows();
			this.overflowContainer.addEventListener('scroll', this.handleScroll);
		};

		initShadowObserver() {
			if (this.shadowObserver || !this.overflowContainer) {
				return;
			}

			this.shadowObserver = new ShadowObserver({
				scrollContainer: this.overflowContainer,
				onUpdateShadows: (shadowStates) => {
					this.setState((prevState) => {
						const { showLeftShadow, showRightShadow } = shadowStates;
						if (
							showLeftShadow !== prevState.showLeftShadow ||
							showRightShadow !== prevState.showRightShadow
						) {
							return {
								showLeftShadow,
								showRightShadow,
							};
						}
						return null;
					});
				},
			});
		}

		render() {
			const { showLeftShadow, showRightShadow } = this.state;

			let classNames = [
				showRightShadow && shadowClassNames.RIGHT_SHADOW,
				showLeftShadow && shadowClassNames.LEFT_SHADOW,
				options.useShadowObserver && shadowObserverClassNames.SHADOW_CONTAINER,
			]
				.filter(Boolean)
				.join(' ');

			return (
				<Component handleRef={this.handleContainer} shadowClassNames={classNames} {...this.props} />
			);
		}
	};
}
