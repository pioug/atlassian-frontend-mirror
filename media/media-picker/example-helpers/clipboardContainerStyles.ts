import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

interface ClipboardContainerProps {
	isWindowFocused: boolean;
}

export const clipboardContainerStyles = ({
	isWindowFocused,
}: // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
ClipboardContainerProps): SerializedStyles =>
	css({
		padding: '10px',
		minHeight: '400px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		border: isWindowFocused ? `1px dashed gray` : `1px dashed transparent`,
	});
