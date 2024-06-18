/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type CSSProperties, PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { CSSTransition } from 'react-transition-group';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import ProgressBar from './bar';
import {
	LABEL_TOP_SPACING,
	varBackgroundColor,
	varMarkerColor,
	varTransitionDelay,
	varTransitionEasing,
	varTransitionSpeed,
} from './constants';
import ProgressMarker from './marker';
import type { ProgressTrackerStageProps } from './types';
import { getFontWeight, getMarkerColor, getTextColor } from './utils';

interface State {
	transitioning: boolean;
	oldMarkerColor?: string;
	oldPercentageComplete: number;
}

const listItemContentStyles = xcss({ width: '100%', position: 'relative' });

const listItemStyles = css({
	margin: token('space.0', '0px'),
	overflowWrap: 'break-word',
});

const titleStyles = css({
	font: token('font.body'),
	marginBlockStart: LABEL_TOP_SPACING,
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-appear': {
		opacity: 0.01,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-appear.fade-appear-active': {
		opacity: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `opacity var(${varTransitionSpeed}) cubic-bezier(0.2, 0, 0, 1)`,
	},
});

export type { ProgressTrackerStageProps };

export default class ProgressTrackerStage extends PureComponent<ProgressTrackerStageProps, State> {
	constructor(props: ProgressTrackerStageProps) {
		super(props);
		this.state = {
			transitioning: false,
			oldMarkerColor: getMarkerColor(this.props.item.status),
			oldPercentageComplete: 0,
		};
	}

	UNSAFE_componentWillMount() {
		this.setState({
			...this.state,
			transitioning: true,
		});
	}

	UNSAFE_componentWillReceiveProps() {
		this.setState({
			...this.state,
			transitioning: true,
		});
	}

	shouldShowLink() {
		return this.props.item.status === 'visited' && !this.props.item.noLink;
	}

	onEntered = () => {
		this.setState({
			transitioning: false,
			oldMarkerColor: getMarkerColor(this.props.item.status),
			oldPercentageComplete: this.props.item.percentageComplete,
		});
	};

	render() {
		const { item, render, transitionDelay, transitionSpeed, transitionEasing, testId } = this.props;

		const ariaCurrent = item.status === 'current' ? 'step' : 'false';

		const listInlineStyles = {
			[varTransitionSpeed]: `${transitionSpeed}ms`,
			[varTransitionDelay]: `${transitionDelay}ms`,
			[varTransitionEasing]: transitionEasing,
			[varMarkerColor]: this.state.oldMarkerColor,
			[varBackgroundColor]: getMarkerColor(item.status),
		} as CSSProperties;

		return (
			<li
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={listInlineStyles}
				css={listItemStyles}
				aria-current={ariaCurrent}
			>
				<Box xcss={listItemContentStyles}>
					<CSSTransition
						appear
						in={this.state.transitioning}
						onEntered={this.onEntered}
						timeout={transitionDelay + transitionSpeed}
						classNames="fade"
					>
						<ProgressMarker testId={testId && `${testId}-marker`} />
					</CSSTransition>
					<CSSTransition
						appear
						in={this.state.transitioning}
						onEntered={this.onEntered}
						timeout={transitionDelay + transitionSpeed}
						classNames="fade"
					>
						<ProgressBar
							testId={testId && `${testId}-bar`}
							percentageComplete={item.percentageComplete}
						/>
					</CSSTransition>
					<CSSTransition
						appear
						in={this.state.transitioning}
						onEntered={this.onEntered}
						timeout={transitionDelay + transitionSpeed}
						classNames="fade"
					>
						<div
							css={titleStyles}
							style={{
								color: getTextColor(item.status),
								fontWeight: getFontWeight(item.status),
							}}
							data-testid={testId && `${testId}-title`}
						>
							{this.shouldShowLink() ? render.link({ item }) : item.label}
						</div>
					</CSSTransition>
				</Box>
			</li>
		);
	}
}
