/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';
import { Transition } from 'react-transition-group';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import SlideIn from '@atlaskit/motion/slide-in';
import { fg } from '@atlaskit/platform-feature-flags';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// 8px is the base unit in pixels
const surveyOffset = token('space.600');

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited' | 'unmounted';

const animationDuration: number = 300;
const offscreen = {
	// Hard-coded because there is no large enough space token and this component is not responsive.
	translateX: '488px', //survey container width + survey offset
	opacity: '0',
};

const getAnimationProps = (state: TransitionState) => {
	switch (state) {
		case 'entered': {
			return {
				translateX: '0',
				opacity: '1',
			};
		}
		case 'entering':
		case 'unmounted':
		case 'exited':
		case 'exiting': {
			return offscreen;
		}
	}
};

type Props = {
	/** A function that returns Node to be rendered (`<ContextualSurvey/>`)
	 * Using a function as child so that the child node does
	 * not need to be evaluated if it is not mounted
	 */
	children: () => ReactNode;
	/** Whether the form should be rendered */
	shouldShow: boolean;
};

const transitionBaseStyles = css({
	position: 'fixed',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	right: surveyOffset,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	bottom: surveyOffset,
	transitionProperty: 'transform, opacity',
});

const marshalLayoutStyles = css({
	position: 'fixed',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	right: surveyOffset,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	bottom: surveyOffset,
});

const marshalMotionLayerStyles = css({
	zIndex: layers.flag(),
});

export default function SurveyMarshal(props: Props): React.JSX.Element {
	const { children, shouldShow } = props;

	if (fg('platform_contextual_survey_use_atlaskit_motion')) {
		return (
			<ExitingPersistence appear>
				{shouldShow && (
					<SlideIn key="contextual-survey-marshal" enterFrom="right" fade="inout" duration="medium">
						{(motionProps) => (
							<div
								ref={motionProps.ref}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- motion keyframes
								className={motionProps.className}
								css={[marshalLayoutStyles, marshalMotionLayerStyles]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- motion animation styles
								style={motionProps.style}
							>
								{children()}
							</div>
						)}
					</SlideIn>
				)}
			</ExitingPersistence>
		);
	}

	return (
		<Transition in={shouldShow} timeout={animationDuration} unmountOnExit>
			{(state: TransitionState) => {
				const { translateX, opacity } = getAnimationProps(state);

				return (
					<div
						css={transitionBaseStyles}
						style={{
							opacity: opacity,
							transition: `all ${animationDuration}ms ease-in-out`,
							zIndex: layers.flag(),
							transform: `translateX(${translateX})`,
						}}
					>
						{children()}
					</div>
				);
			}}
		</Transition>
	);
}
