/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, PureComponent } from 'react';

import { css, keyframes } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const listItemStyles = css({
	listStyleType: 'none',
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.0', '0px'),
	overflowWrap: 'break-word'
});

const fadeAnimationBase = css({
	opacity: 1,
});

const fadeIn = keyframes({
	from: {
		opacity: 0.01,
	},
	to: {
		opacity: 1,
	},
});

const fadeAnimationActive = css({
	animation: `${fadeIn} var(--ds--pt--ts) var(--ds--pt--te) forwards`,
	animationDelay: `var(--ds--pt--td)`,
	animationPlayState: 'paused',
});

const titleStyles = css({
	font: token('font.body'),
	marginBlockStart: token('space.250'),
	textAlign: 'center',
});

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ProgressTrackerStage extends PureComponent<ProgressTrackerStageProps, State> {
	private animationTimeoutId?: ReturnType<typeof setTimeout>;

	constructor(props: ProgressTrackerStageProps) {
		super(props);
		this.state = {
			transitioning: false,
			oldPercentageComplete: 0,
		};
	}

	componentDidUpdate(prevProps: ProgressTrackerStageProps): void {
		if (
			prevProps.item.status !== this.props.item.status ||
			prevProps.item.percentageComplete !== this.props.item.percentageComplete
		) {
			this.startTransition();
		}
	}

	componentWillUnmount(): void {
		if (this.animationTimeoutId) {
			clearTimeout(this.animationTimeoutId);
		}
	}

	startTransition(): void {
		if (this.animationTimeoutId) {
			clearTimeout(this.animationTimeoutId);
		}

		this.setState({
			...this.state,
			transitioning: true,
		});

		const timeout = this.props.transitionDelay + this.props.transitionSpeed;
		this.animationTimeoutId = setTimeout(() => {
			this.onEntered();
		}, timeout);
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
					<ProgressMarker
						testId={testId && `${testId}-marker`}
						status={item.percentageComplete > 0 ? 'visited' : item.status}
					/>
					<div
						css={[fadeAnimationBase, fadeAnimationActive]}
						style={{
							animationPlayState: this.state.transitioning ? 'running' : 'paused',
							animationDuration: ['visited', 'disabled'].includes(this.props.item.status) ? '0ms' : undefined,
						}}
					>
						<ProgressBar
							testId={testId && `${testId}-bar`}
							percentageComplete={item.percentageComplete}
						/>
					</div>
					<div
						css={[
							fadeAnimationBase,
							titleStyles,
							textColor[item.status],
							fontWeight[item.status],
						]}
						data-testid={testId && `${testId}-title`}
					>
						{this.shouldShowLink() ? render.link({ item }) : item.label}
					</div>
				</Box>
			</li>
		);
	}
}
