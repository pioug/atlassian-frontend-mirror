import React from 'react';

import { canUseDOM } from 'exenv';
import ScrollLock from 'react-scrolllock';
import scrollIntoView from 'scroll-into-view-if-needed';

import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import { type ScrollLogicalPosition, type SpotlightProps } from '../types';
import { type ElementBoundingBox, ElementBox } from '../utils/use-element-box';

import { Fade } from './animation';
import Clone from './clone';
import NodeResolverSpotlightInner from './node-resolver-spotlight-inner';
import SpotlightDialog from './spotlight-dialog';
import { SpotlightTransitionConsumer } from './spotlight-transition';

export interface SpotlightInnerProps extends SpotlightProps {
	/**
	 * The spotlight target DOM element.
	 */
	targetNode: HTMLElement;
	/**
	 * Called when the component has been mounted.
	 */
	onOpened: () => any;
	/**
	 * Called when the component has been unmounted.
	 */
	onClosed: () => any;

	/**
	 * Whether to display a pulse animation around the spotlighted element.
	 *
	 * Same as `SpotlightProps` but required instead of optional.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	pulse: boolean;
	/**
	 * The width of the dialog in pixels. The minimum possible width is 160px and the maximum width is 600px.
	 *
	 * Same as `SpotlightProps` but required instead of optional.
	 */
	dialogWidth: number;
	/**
	 * passed to scrollIntoView as the block option, which determines the vertical alignment of the target node in the closest scrollable ancestor.
	 */
	scrollPositionBlock?: ScrollLogicalPosition;
}

interface State {
	replacementElement: HTMLElement | null;
}

/**
 * __Spotlight inner__
 *
 * Renders the spotlight target clone and dialog.
 *
 * @internal
 */
class SpotlightInner extends React.Component<SpotlightInnerProps, State> {
	static defaultProps = {
		dialogWidth: 400,
		pulse: true,
	};

	state = {
		// This is only used when targetReplacement is specified.
		// In this case, we have to render the targetReplacement component,
		// get a dom reference from that component, then render again passing
		// that reference into SpotlightDialog (Popper).
		replacementElement: null,
	};

	componentDidUpdate(prevProps: SpotlightInnerProps) {
		if (prevProps.targetNode !== this.props.targetNode) {
			scrollIntoView(this.props.targetNode, {
				scrollMode: 'if-needed',
				block: this.props.scrollPositionBlock,
			});
		}
	}

	componentDidMount() {
		scrollIntoView(this.props.targetNode, {
			scrollMode: 'if-needed',
			block: this.props.scrollPositionBlock,
		});
		this.props.onOpened();
	}

	componentWillUnmount() {
		this.props.onClosed();
	}

	getTargetNodeStyle = (box: ElementBoundingBox) => {
		if (!canUseDOM) {
			return {};
		}

		return {
			...box,
			position: 'fixed',
		};
	};

	render() {
		const {
			pulse,
			target,
			targetNode,
			targetBgColor,
			targetOnClick,
			targetRadius,
			testId,
			targetReplacement: TargetReplacement,
		} = this.props;
		const { replacementElement } = this.state;

		return (
			<SpotlightTransitionConsumer>
				{({ isOpen, onExited }) => (
					<Portal zIndex={layers.spotlight() + 1}>
						{TargetReplacement ? (
							<NodeResolverSpotlightInner
								hasNodeResolver={!fg('platform-design-system-dsp-20262-spotlight-inner')}
								innerRef={(elem: HTMLElement | null) => this.setState({ replacementElement: elem })}
							>
								<ElementBox element={targetNode}>
									{(box) => (
										<TargetReplacement
											data-testid={`${testId}--target`}
											{...this.getTargetNodeStyle(box)}
										/>
									)}
								</ElementBox>
							</NodeResolverSpotlightInner>
						) : (
							<ElementBox element={targetNode}>
								{(box) => (
									<Clone
										testId={`${testId}--target`}
										pulse={pulse}
										target={target}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
										style={this.getTargetNodeStyle(box)}
										targetBgColor={targetBgColor}
										targetNode={targetNode}
										targetOnClick={targetOnClick}
										targetRadius={targetRadius}
									/>
								)}
							</ElementBox>
						)}
						{TargetReplacement && !replacementElement ? null : (
							<Fade hasEntered={isOpen} onExited={onExited}>
								{(animationStyles) => (
									<SpotlightDialog
										testId={`${testId}--dialog`}
										actions={this.props.actions}
										actionsBeforeElement={this.props.actionsBeforeElement}
										children={this.props.children}
										dialogPlacement={this.props.dialogPlacement}
										dialogWidth={this.props.dialogWidth}
										footer={this.props.footer}
										header={this.props.header}
										heading={this.props.heading}
										headingAfterElement={this.props.headingAfterElement}
										image={this.props.image}
										targetNode={replacementElement || targetNode}
										animationStyles={animationStyles}
									/>
								)}
							</Fade>
						)}
						<ScrollLock />
					</Portal>
				)}
			</SpotlightTransitionConsumer>
		);
	}
}

export default SpotlightInner;
