import { type MessageDescriptor } from 'react-intl-next';

import { type Breakpoint } from '../common';
import { type TitleBoxIcon as TitleBoxIconType } from '../../../types';

export type TitleBoxProps = {
	name?: string;
	breakpoint: Breakpoint;
	createdAt?: number;
	titleBoxBgColor?: string;
	titleBoxIcon?: TitleBoxIconType;
	hidden?: boolean;
};

export type FormattedDateProps = { timestamp: number };

export type TitleBoxWrapperProps = {
	breakpoint: Breakpoint;
	hidden?: boolean;
	titleBoxBgColor?: string;
	children?: JSX.Element | JSX.Element[] | any;
};

export type TitleBoxFooterProps = {
	hasIconOverlap: boolean;
	children?: React.ReactNode;
};

export type TitleBoxHeaderProps = {
	hasIconOverlap: boolean;
	children?: JSX.Element;
};

export type OnRetryFunction = () => void;

export type FailedTitleBoxProps = {
	breakpoint: Breakpoint;
	customMessage?: MessageDescriptor;
};
