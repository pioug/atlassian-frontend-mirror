// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { type PastedImageStyleType } from './stylesWrapper';

interface DropzoneContainerProps {
	isActive: boolean;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const popupContainerStyles = css({
	display: 'flex',
	flexDirection: 'column',
	overflow: 'scroll',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const popupHeaderStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
	borderBottom: '1px solid #ccc',
	marginBottom: '15px',
	display: 'flex',
	alignItems: 'center',
	padding: '30px 0',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginRight: '15px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewImageWrapperStyles = css({
	position: 'relative',
	marginRight: '15px',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const infoWrapperStyles = css({
	position: 'absolute',
	width: '160px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
	color: 'black',
	fontSize: '12px',
	top: '120px',
	left: 0,
	textAlign: 'center',
});

export const dropzoneContainerStyles = ({ isActive }: DropzoneContainerProps) =>
	css(
		{
			width: '600px',
			minHeight: '500px',
			border: '1px dashed transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		isActive ? `border-color: gray;` : '',
	);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dropzoneRootStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dropzoneContentWrapperStyles = css({
	display: 'flex',
	minHeight: '200px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewsWrapperStyles = css({
	display: 'flex',
	flexDirection: 'column',
	overflow: 'visible',
	marginLeft: token('space.250', '20px'),
	marginBottom: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const previewsTitleStyles = css({
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const uploadPreviewsFlexRowStyles = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dropzoneItemsInfoStyles = css({
	flex: 1,
	minWidth: '600px',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
});

interface ClipboardContainerProps {
	isWindowFocused: boolean;
}

export const clipboardContainerStyles = ({
	isWindowFocused,
}: // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
ClipboardContainerProps) =>
	css({
		padding: '10px',
		minHeight: '400px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		border: isWindowFocused ? `1px dashed gray` : `1px dashed transparent`,
	});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const infoContainerStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	margin: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
	border: '5px dashed #81ebff',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
	boxShadow: '10px 10px 15px rgba(0, 0, 0, 0.3)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.info': {
		position: 'absolute',
		left: 0,
		bottom: '-30px',
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
		backgroundColor: 'black',
		opacity: 0.5,
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- needs to be converted to tokens
		color: 'white',
		whiteSpace: 'nowrap',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.close_button': {
		position: 'absolute',
		top: 0,
		right: 0,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const pastedImageStyles = (style: PastedImageStyleType) => css`
	width: ${style.width ? `${style.width}px` : '100%'};
	${style.height ? `height: ${style.height}px` : ''};
`;
