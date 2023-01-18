import { MessageDescriptor } from 'react-intl-next';

import { Breakpoint } from '../common';
import { TitleBoxIcon as TitleBoxIconType } from '../../../types';

import { GlobalThemeTokens } from '@atlaskit/theme/components';

export type TitleBoxProps = {
  name: string;
  breakpoint: Breakpoint;
  createdAt?: number;
  titleBoxBgColor?: string;
  titleBoxIcon?: TitleBoxIconType;
};

export type FormattedDateProps = { timestamp: number };

export type TitleBoxWrapperProps = {
  breakpoint: Breakpoint;
  titleBoxBgColor?: string;
  children?: JSX.Element | JSX.Element[] | any;
  theme?: GlobalThemeTokens;
};

export type TitleBoxFooterProps = {
  hasIconOverlap: boolean;
  children?: JSX.Element;
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
