/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	'*': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		animationTimingFunction: 'step-end !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		animationDuration: '0s !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		transitionTimingFunction: 'step-end !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		transitionDuration: '0s !important',
	},
});

type Props = {
	children: React.ReactNode;
};

const VRTestWrapper = ({ children }: Props): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<div className="vr-test-wrapper" css={globalStyles}>
			{children}
		</div>
	);
};

export default VRTestWrapper;
