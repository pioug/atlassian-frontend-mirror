/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren } from 'react';

import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { IFrame } from '../../src/view/EmbedCard/components/IFrame';
import HoverCardControl from '../../src/view/FlexibleCard/components/container/hover-card-control';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';

const defaultStyle: React.CSSProperties = {
	// We are keeping this padding as a hardcoded variable as it is not a standard token size and needs
	// to be thoroughly checked with a designer so that we do not miss an unintended visual change
	padding: '10px',
};

const iframeContent = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;

const MockIFrame = injectable(IFrame, ({ childRef, ...props }) => (
	// eslint-disable-next-line jsx-a11y/iframe-has-title
	<iframe ref={childRef} {...props} srcDoc={iframeContent} />
));

const mockHoverCardControl = injectable(HoverCardControl, (props) => (
	<HoverCardControl {...props} delay={0} />
));

const mockHoverCardComponent = injectable(HoverCardComponent, (props) => (
	<HoverCardComponent {...props} noFadeDelay={true} />
));

const dependencies = [MockIFrame, mockHoverCardControl, mockHoverCardComponent];

export type VRTestWrapperProps = PropsWithChildren<{
	/**
	 * Add / override additional CSS styles
	 */
	style?: React.CSSProperties;
}>;

const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
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

const VRTestWrapper = ({ children, style }: VRTestWrapperProps) => {
	return (
		<DiProvider use={dependencies}>
			<IntlProvider locale="en">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/enforce-style-prop */}
				<div className="vr-test-wrapper" style={{ ...defaultStyle, ...style }} css={globalStyles}>
					{children}
				</div>
			</IntlProvider>
		</DiProvider>
	);
};

export default VRTestWrapper;
