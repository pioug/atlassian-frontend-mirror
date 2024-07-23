/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type ReactNode, forwardRef } from 'react';

import {
	clipboardContainerStyles,
	dropzoneContainerStyles,
	dropzoneContentWrapperStyles,
	dropzoneItemsInfoStyles,
	infoContainerStyles,
	infoWrapperStyles,
	pastedImageStyles,
	popupContainerStyles,
	popupHeaderStyles,
	previewImageWrapperStyles,
	previewsTitleStyles,
	previewsWrapperStyles,
	uploadPreviewsFlexRowStyles,
} from './styles';

export const PopupContainer = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={popupContainerStyles}>{children}</div>;
};

export const PopupHeader = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={popupHeaderStyles}>{children}</div>;
};

export const PreviewImageWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={previewImageWrapperStyles}>{children}</div>;
};

export const InfoWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <pre css={infoWrapperStyles}>{children}</pre>;
};

export const DropzoneContainer = forwardRef(({ isActive }: { isActive: boolean }, ref) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={dropzoneContainerStyles({ isActive })} ref={ref as React.RefObject<HTMLDivElement>} />
	);
});

export const DropzoneContentWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={dropzoneContentWrapperStyles}>{children}</div>;
};

export const PreviewsWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={previewsWrapperStyles}>{children}</div>;
};

export const PreviewsTitle = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <h1 css={previewsTitleStyles}>{children}</h1>;
};

export const UploadPreviewsFlexRow = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={uploadPreviewsFlexRowStyles}>{children}</div>;
};

export const DropzoneItemsInfo = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={dropzoneItemsInfoStyles}>{children}</div>;
};

export const ClipboardContainer = ({
	isWindowFocused,
	children,
}: {
	isWindowFocused: boolean;
	children: ReactNode;
}) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={clipboardContainerStyles({ isWindowFocused })}>{children}</div>;
};

export const InfoContainer = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={infoContainerStyles}>{children}</div>;
};

export type PastedImageStyleType = {
	width: number | string;
	height: number | string;
};

type PastedImageProps = {
	src: string;
	title: string;
	style: PastedImageStyleType;
};

export const PastedImage = ({ src, style, title }: PastedImageProps) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <img src={src} title={title} css={pastedImageStyles(style)} />;
};
