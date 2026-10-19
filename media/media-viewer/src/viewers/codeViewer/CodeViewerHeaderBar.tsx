/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { useIsInsetViewer } from '../../insetViewerContext';

const codeViewerHeaderBarStyles = css({
	height: '75px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#1d2125',
});

export const CodeViewerHeaderBar = (): JSX.Element | null => {
	const isInsetViewer = useIsInsetViewer();
	// The inset viewer has its own header row, so there is nothing to clear.
	if (isInsetViewer) {
		return null;
	}
	return <div css={codeViewerHeaderBarStyles}></div>;
};
