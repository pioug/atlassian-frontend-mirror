import React from 'react';
import { Component, type ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { RightSidePanelDrawer, RightSidePanelDrawerContent, transitionDurationMs } from './styled';

export type TransitionStatus = 'unmounted' | 'exiting' | 'entering' | 'entered' | 'exited';

export interface Props {
	// ID for the HTML tag where we want to attach the RightSidePanel
	attachPanelTo: string;
	// Right Hand Side panel content
	children?: ReactNode;
	// Disable enter animation (false by default)
	disableEnterAnimation?: boolean;
	// Disable exit animation (false by default)
	disableExitAnimation?: boolean;
	// Open/Closed state
	isOpen: boolean;
	// Mount component on enter (true by default)
	mountOnEnter?: boolean;
	// Function to be executed when the close animation finishes
	onCloseAnimationFinished?: () => void;
	// Function to be executed when the open animation finishes
	onOpenAnimationFinished?: () => void;
	// Don't animate the component when the component is mounted (false by default)
	skipAnimationOnMount?: boolean;
	// Unmount component on exit (true by default)
	unmountOnExit?: boolean;
	// Width for the panel, default is 368px
	width?: number;
}

export interface State {
	container?: Element | null; // Element in where the RightSidePanel will be attached
	entered: boolean;
}

export class RightSidePanel extends Component<Props, State> {
	attachPanelTo = this.props.attachPanelTo;

	state = {
		entered: false,
		container: undefined,
	};

	componentDidMount() {
		this.setState({
			container: canUseDOM ? document.querySelector('#' + this.attachPanelTo) : undefined,
		});
	}

	renderDrawer(Container: HTMLElement): ReactNode {
		const {
			children,
			isOpen,
			skipAnimationOnMount = false,
			mountOnEnter = true,
			unmountOnExit = true,
			disableEnterAnimation = false,
			disableExitAnimation = false,
			onOpenAnimationFinished,
			onCloseAnimationFinished,
		} = this.props;

		return createPortal(
			<Transition
				in={isOpen}
				timeout={transitionDurationMs}
				mountOnEnter={mountOnEnter}
				unmountOnExit={unmountOnExit}
				appear={!skipAnimationOnMount}
				enter={!disableEnterAnimation}
				exit={!disableExitAnimation}
				onEntered={onOpenAnimationFinished}
				onExited={onCloseAnimationFinished}
			>
				{(state: TransitionStatus) => (
					<RightSidePanelDrawer transitionState={state} width={this.props.width}>
						<RightSidePanelDrawerContent width={this.props.width}>
							{children}
						</RightSidePanelDrawerContent>
					</RightSidePanelDrawer>
				)}
			</Transition>,
			Container,
		);
	}

	render() {
		const { container } = this.state;

		return !!container ? this.renderDrawer(container!) : null;
	}
}

export default RightSidePanel;
