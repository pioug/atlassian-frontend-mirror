/** @jsx jsx */
import { jsx } from '@emotion/react';
import { type ReactNode, type FC } from 'react';
import { enableMediaUfoLogger } from '@atlaskit/media-test-helpers';
import { payloadPublisher } from '@atlassian/ufo';
import {
  containerStyles,
  groupStyles,
  buttonListStyles,
  mVSidebarHeaderStyles,
  mVSidebarStyles,
} from './styles';

type Props = {
  children: ReactNode;
  shouldApplyStyles?: Boolean;
};

export const MainWrapper: FC<Props> = ({
  children,
  shouldApplyStyles = true,
}) => {
  enableMediaUfoLogger(payloadPublisher);
  return <div css={shouldApplyStyles && containerStyles}>{children}</div>;
};

export const Group: FC<Props> = ({ children }) => {
  return <div css={groupStyles}>{children}</div>;
};

export const ButtonList: FC<Props> = ({ children }) => {
  return <ul css={buttonListStyles}>{children}</ul>;
};

export const MVSidebarHeader: FC<Props> = ({ children }) => {
  return <div css={mVSidebarHeaderStyles}>{children}</div>;
};

export const MVSidebar: FC<Props> = ({ children }) => {
  return <div css={mVSidebarStyles}>{children}</div>;
};
