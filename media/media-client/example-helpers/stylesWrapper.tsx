/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type ChangeEvent, type ReactNode } from 'react';
import {
	cardsWrapperStyles,
	fileInputStyles,
	fileStateWrapperStyles,
	fileWrapperStyles,
	headerStyles,
	imagePreviewStyles,
	metadataWrapperStyles,
	previewWrapperStyles,
	responseStyles,
	rowStyles,
	uploadTouchWrapperStyles,
	wrapperStyles,
} from './styles';
import { type FileStatus } from '../src';

export const Wrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={wrapperStyles}>{children}</div>;
};

interface ImagePreviewProps {
	src: string;
	alt: string;
}

export const ImagePreview = ({ src, alt }: ImagePreviewProps) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <img css={imagePreviewStyles} src={src} alt={alt} />;
};

export const PreviewWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={previewWrapperStyles}>{children}</div>;
};

export const MetadataWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <pre css={metadataWrapperStyles}>{children}</pre>;
};

type FileInputProps = {
	type: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FileInput = ({ type, onChange }: FileInputProps) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <input css={fileInputStyles} type={type} onChange={onChange} />;
};

export const FileWrapper = ({ children, status }: { children: ReactNode; status: FileStatus }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={fileWrapperStyles(status)}>{children}</div>;
};

export const CardsWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={cardsWrapperStyles}>{children}</div>;
};

export const Header = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={headerStyles}>{children}</div>;
};

export const FileStateWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={fileStateWrapperStyles}>{children}</div>;
};

export const UploadTouchWrapper = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={uploadTouchWrapperStyles}>{children}</div>;
};

export const Row = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={rowStyles}>{children}</div>;
};

export const Response = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={responseStyles}>{children}</div>;
};
