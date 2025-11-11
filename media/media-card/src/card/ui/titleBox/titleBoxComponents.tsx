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

export const TitleBoxWrapper = (props: TitleBoxWrapperProps) => (
  <CompiledTitleBoxWrapper {...props} />
);

export const TitleBoxHeader = (props: TitleBoxHeaderProps) => (
  <CompiledTitleBoxHeader {...props} />
);

export const TitleBoxFooter = (props: TitleBoxFooterProps) => (
  <CompiledTitleBoxFooter {...props} />
);

export const TitleBoxIcon = (props: any) => (
  <CompiledTitleBoxIcon {...props} />
);

export const ErrorMessageWrapper = (props: any) => (
  <CompiledErrorMessageWrapper {...props} />
);
