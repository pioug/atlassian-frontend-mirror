/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';
import { Transition } from 'react-transition-group';

import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// 8px is the base unit in pixels
const surveyOffset = token('space.600', '48px');

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

export default function SurveyMarshal(props: Props) {
	const { children, shouldShow } = props;

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
