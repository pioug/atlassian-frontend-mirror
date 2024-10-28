import { type ReactNode } from 'react';
import { type MessageDescriptor } from 'react-intl-next';

export type InternalIconMessageProps = {
	messageDescriptor: MessageDescriptor;
	animated?: boolean;
};

export type CreatingPreviewProps = {
	disableAnimation?: boolean;
};

export type StyledTextProps = {
	animated?: boolean;
	reducedFont?: boolean;
};

export type IconMessageWrapperProps = {
	animated?: boolean;
	reducedFont?: boolean;
	children?: ReactNode;
};
