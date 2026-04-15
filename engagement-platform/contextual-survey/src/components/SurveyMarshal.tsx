/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import SlideIn from '@atlaskit/motion/slide-in';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// 8px is the base unit in pixels
const surveyOffset = token('space.600');

type Props = {
	/** A function that returns Node to be rendered (`<ContextualSurvey/>`)
	 * Using a function as child so that the child node does
	 * not need to be evaluated if it is not mounted
	 */
	children: () => ReactNode;
	/** Whether the form should be rendered */
	shouldShow: boolean;
};

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
