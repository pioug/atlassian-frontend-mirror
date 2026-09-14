/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

const codeViewerHeaderBarStyles = css({
	height: '75px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#1d2125',
});

export const CodeViewerHeaderBar = (): JSX.Element => {
	return <div css={codeViewerHeaderBarStyles}></div>;
};
