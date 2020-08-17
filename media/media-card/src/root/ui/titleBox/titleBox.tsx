import React from 'react';
import { TitleBoxWrapper, TitleBoxHeader, TitleBoxFooter } from './styled';
// eslint-disable-next-line no-restricted-imports
import { format } from 'date-fns';
import { Breakpoint } from '../common';
import { Truncate } from '@atlaskit/media-ui/truncateText';

export type TitleBoxProps = {
  name: string;
  breakpoint: Breakpoint;
  createdAt?: number;
};

export const formatDate = (timestamp?: number) =>
  timestamp ? format(new Date(timestamp), `DD MMM YYYY, hh:mm A`) : '';

export const TitleBox = ({ name, createdAt, breakpoint }: TitleBoxProps) => (
  <TitleBoxWrapper breakpoint={breakpoint}>
    <TitleBoxHeader>
      <Truncate text={name} />
    </TitleBoxHeader>
    <TitleBoxFooter>{formatDate(createdAt)}</TitleBoxFooter>
  </TitleBoxWrapper>
);
