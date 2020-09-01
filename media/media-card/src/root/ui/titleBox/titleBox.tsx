import React from 'react';
import { TitleBoxWrapper, TitleBoxHeader, TitleBoxFooter } from './styled';
import { Breakpoint } from '../common';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { FormattedDate } from './formattedDate';

export type TitleBoxProps = {
  name: string;
  breakpoint: Breakpoint;
  createdAt?: number;
};

export const TitleBox = ({ name, createdAt, breakpoint }: TitleBoxProps) => (
  <TitleBoxWrapper breakpoint={breakpoint}>
    <TitleBoxHeader>
      <Truncate text={name} />
    </TitleBoxHeader>
    {createdAt ? (
      <TitleBoxFooter>
        <FormattedDate timestamp={createdAt} />
      </TitleBoxFooter>
    ) : null}
  </TitleBoxWrapper>
);
