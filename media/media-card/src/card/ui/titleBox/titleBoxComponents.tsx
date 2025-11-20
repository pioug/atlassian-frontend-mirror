import React from 'react';
import {
	TitleBoxWrapper as CompiledTitleBoxWrapper,
	TitleBoxHeader as CompiledTitleBoxHeader,
	TitleBoxFooter as CompiledTitleBoxFooter,
	TitleBoxIcon as CompiledTitleBoxIcon,
	ErrorMessageWrapper as CompiledErrorMessageWrapper,
} from './titleBoxComponents-compiled';

import {
	type TitleBoxFooterProps,
	type TitleBoxHeaderProps,
	type TitleBoxWrapperProps,
} from './types';

export const TitleBoxWrapper = (props: TitleBoxWrapperProps): React.JSX.Element => (
	<CompiledTitleBoxWrapper {...props} />
);

export const TitleBoxHeader = (props: TitleBoxHeaderProps): React.JSX.Element => (
	<CompiledTitleBoxHeader {...props} />
);

export const TitleBoxFooter = (props: TitleBoxFooterProps): React.JSX.Element => (
	<CompiledTitleBoxFooter {...props} />
);

export const TitleBoxIcon = (props: any): React.JSX.Element => <CompiledTitleBoxIcon {...props} />;

export const ErrorMessageWrapper = (props: any): React.JSX.Element => (
	<CompiledErrorMessageWrapper {...props} />
);
