/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { forwardRef } from 'react';
export interface ContentWrapperProps {
	controlsAreVisible: boolean;
}

const inactivityDetectorWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	flex: 1,
	overflow: 'visible',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.mvng-hide-controls': {
		transition: 'opacity .3s',
	},
});
const inactivityDetectorControlsVisibleStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.mvng-hide-controls': {
		opacity: 1,
	},
});

const inactivityDetectorControlsNotVisibleStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.mvng-hide-controls': {
		opacity: 0,
	},
});

export const InactivityDetectorWrapper = forwardRef(
	(
		{
			controlsAreVisible,
			children,
			...props
		}: ContentWrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<div
				css={[
					inactivityDetectorWrapperStyles,
					controlsAreVisible && inactivityDetectorControlsVisibleStyles,
					!controlsAreVisible && inactivityDetectorControlsNotVisibleStyles,
				]}
				ref={ref as React.RefObject<HTMLDivElement>}
				{...props}
			>
				{children}
			</div>
		);
	},
);
