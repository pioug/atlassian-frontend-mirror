import React from 'react';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { TitleBoxIcon as TitleBoxIconType } from '../../../index';
import {
  TitleBoxWrapper,
  TitleBoxHeader,
  TitleBoxFooter,
  TitleBoxIcon,
} from './styled';
import { Breakpoint } from '../common';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { FormattedDate } from './formattedDate';

export type TitleBoxProps = {
  name: string;
  breakpoint: Breakpoint;
  createdAt?: number;
  titleBoxBgColor?: string;
  titleBoxIcon?: TitleBoxIconType;
};

export const TitleBox = ({
  name,
  createdAt,
  breakpoint,
  titleBoxBgColor,
  titleBoxIcon,
}: TitleBoxProps) => (
  <TitleBoxWrapper breakpoint={breakpoint} titleBoxBgColor={titleBoxBgColor}>
    <TitleBoxHeader hasIconOverlap={!!titleBoxIcon && !createdAt}>
      <Truncate text={name} />
    </TitleBoxHeader>
    {createdAt ? (
      <TitleBoxFooter hasIconOverlap={!!titleBoxIcon}>
        <FormattedDate timestamp={createdAt} />
      </TitleBoxFooter>
    ) : null}
    {titleBoxIcon === 'LockFilledIcon' && (
      <TitleBoxIcon>
        <LockFilledIcon label="" size="small" />
      </TitleBoxIcon>
    )}
  </TitleBoxWrapper>
);
