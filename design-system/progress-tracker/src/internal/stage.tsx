/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createRef, type CSSProperties, PureComponent } from 'react';

import { css } from '@compiled/react';
import { CSSTransition } from 'react-transition-group';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { B300, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Status } from '../types';

import ProgressBar from './bar';
import ProgressMarker from './marker';
import type { ProgressTrackerStageProps } from './types';

const styles = cssMap({
	listItemContent: { width: '100%', position: 'relative' },
});

interface State {
	transitioning: boolean;
	oldMarkerColor?: string;
	oldPercentageComplete: number;
}

const textColor = cssMap({
	unvisited: {
		color: token('color.text.subtlest'),
	},
	current: {
		color: token('color.text.brand'),
	},
	visited: {
		color: token('color.text'),
	},
	disabled: {
		color: token('color.text.disabled'),
	},
});

const fontWeight = cssMap({
	unvisited: {
		fontWeight: token('font.weight.regular'),
	},
	current: {
		fontWeight: token('font.weight.bold'),
	},
	visited: {
		fontWeight: token('font.weight.bold'),
	},
	disabled: {
		fontWeight: token('font.weight.bold'),
	},
});

const getMarkerColor = ({
	status,
	percentageCompleted,
}: {
	status: Status;
	percentageCompleted: number;
}) => {
	switch (status) {
		case 'unvisited':
			return token('color.icon.subtle', N70);
		case 'current':
		case 'visited':
			return token('color.icon.brand', B300);
		case 'disabled':
			if (percentageCompleted === 0) {
				return token('color.icon.disabled', N70);
			}
			// If the percentage completed is greater than 0, we show the brand colour, so that the marker (circle) blends in with the progress bar.
			// Otherwise, the grey marker would be visible within the progress bar.
			return token('color.icon.brand', B300);
		default:
			return;
	}
};

const listItemStyles = css({
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.0', '0px'),
	overflowWrap: 'break-word',
});

const titleStyles = css({
	font: token('font.body'),
	marginBlockStart: token('space.250'),
	textAlign: 'center',
	transition: `opacity var(--ds--pt--ts) cubic-bezier(0.2, 0, 0, 1)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles -- Ignored via go/DSP-18766
	'&.fade-appear': {
		opacity: 0.01,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles -- Ignored via go/DSP-18766
	'&.fade-appear.fade-appear-active': {
		opacity: 1,
		transition: `opacity var(--ds--pt--ts) cubic-bezier(0.2, 0, 0, 1)`,
	},
});

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ProgressTrackerStage extends PureComponent<ProgressTrackerStageProps, State> {
	nodeRefMarker = createRef<HTMLElement>();
	nodeRefBar = createRef<HTMLElement>();
	nodeRefTitle = createRef<HTMLElement>();
	constructor(props: ProgressTrackerStageProps) {
		super(props);
		this.state = {
			transitioning: false,
			oldMarkerColor: getMarkerColor({
				status: this.props.item.status,
				percentageCompleted: this.props.item.percentageComplete,
			}),
			oldPercentageComplete: 0,
		};
	}

	UNSAFE_componentWillMount(): void {
		this.setState({
			...this.state,
			transitioning: true,
		});
	}

	UNSAFE_componentWillReceiveProps(): void {
		this.setState({
			...this.state,
			transitioning: true,
		});
	}

	shouldShowLink(): boolean {
		return (
			this.props.item.status === 'visited' &&
			// TODO: `noLink` is unnecessary as we should just be detecting if the `href` is set...
			!this.props.item.noLink
		);
	}

	onEntered = (): void => {
		this.setState({
			transitioning: false,
			oldMarkerColor: getMarkerColor({
				status: this.props.item.status,
				percentageCompleted: this.props.item.percentageComplete,
			}),
			oldPercentageComplete: this.props.item.percentageComplete,
		});
	};

	render() {
		const { item, render, transitionDelay, transitionSpeed, transitionEasing, testId } = this.props;

		const ariaCurrent = item.status === 'current' ? 'step' : 'false';

		const listInlineStyles = {
			['--ds--pt--ts']: `${transitionSpeed}ms`,
			['--ds--pt--td']: `${transitionDelay}ms`,
			['--ds--pt--te']: transitionEasing,
			['--ds--pt--mc']: this.state.oldMarkerColor,
			['--ds--pt--bg']: getMarkerColor({
				status: item.status,
				percentageCompleted: item.percentageComplete,
			}),
			listStyleType: 'none',
		} as CSSProperties;

		return (
			<li
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={listInlineStyles}
				css={listItemStyles}
				aria-current={ariaCurrent}
			>
				<Box xcss={styles.listItemContent}>
					<CSSTransition
						appear
						in={this.state.transitioning}
						onEntered={this.onEntered}
						timeout={transitionDelay + transitionSpeed}
						classNames="fade"
						nodeRef={this.nodeRefMarker}
					>
						<ProgressMarker testId={testId && `${testId}-marker`} />
					</CSSTransition>
					<CSSTransition
						appear
						in={this.state.transitioning}
						onEntered={this.onEntered}
						timeout={transitionDelay + transitionSpeed}
						classNames="fade"
						nodeRef={this.nodeRefBar}
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
						nodeRef={this.nodeRefTitle}
					>
						<div
							css={[titleStyles, textColor[item.status], fontWeight[item.status]]}
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
