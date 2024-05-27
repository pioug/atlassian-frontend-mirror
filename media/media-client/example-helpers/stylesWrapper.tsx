/** @jsx jsx */
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
  return <div css={wrapperStyles}>{children}</div>;
};

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export const ImagePreview = ({ src, alt }: ImagePreviewProps) => {
  return <img css={imagePreviewStyles} src={src} alt={alt} />;
};

export const PreviewWrapper = ({ children }: { children: ReactNode }) => {
  return <div css={previewWrapperStyles}>{children}</div>;
};

export const MetadataWrapper = ({ children }: { children: ReactNode }) => {
  return <pre css={metadataWrapperStyles}>{children}</pre>;
};

type FileInputProps = {
  type: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FileInput = ({ type, onChange }: FileInputProps) => {
  return <input css={fileInputStyles} type={type} onChange={onChange} />;
};

export const FileWrapper = ({
  children,
  status,
}: {
  children: ReactNode;
  status: FileStatus;
}) => {
  return <div css={fileWrapperStyles(status)}>{children}</div>;
};

export const CardsWrapper = ({ children }: { children: ReactNode }) => {
  return <div css={cardsWrapperStyles}>{children}</div>;
};

export const Header = ({ children }: { children: ReactNode }) => {
  return <div css={headerStyles}>{children}</div>;
};

export const FileStateWrapper = ({ children }: { children: ReactNode }) => {
  return <div css={fileStateWrapperStyles}>{children}</div>;
};

export const UploadTouchWrapper = ({ children }: { children: ReactNode }) => {
  return <div css={uploadTouchWrapperStyles}>{children}</div>;
};

export const Row = ({ children }: { children: ReactNode }) => {
  return <div css={rowStyles}>{children}</div>;
};

export const Response = ({ children }: { children: ReactNode }) => {
  return <div css={responseStyles}>{children}</div>;
};
