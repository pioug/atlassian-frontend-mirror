/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { IFrame } from '../../src/view/EmbedCard/components/IFrame';
import HoverCardControl from '../../src/view/FlexibleCard/components/container/hover-card-control';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';

import { global } from './vr-test';

const styles = css({
	// We are keeping this padding as a hardcoded variable as it is not a standard token size and needs
	// to be thoroughly checked with a designer so that we do not miss an unintended visual change
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	padding: '10px',
});

const iframeContent = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;

const MockIFrame = injectable(IFrame, ({ childRef, ...props }) => (
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
	overrideCss?: SerializedStyles;
}>;
const VRTestWrapper = ({ children, overrideCss }: VRTestWrapperProps) => {
	return (
		<DiProvider use={dependencies}>
			<IntlProvider locale="en">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div className="vr-test-wrapper" css={[styles, overrideCss]}>
					{global}
					{children}
				</div>
			</IntlProvider>
		</DiProvider>
	);
};

export default VRTestWrapper;
