import React from 'react';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { injectIntl } from 'react-intl';
import { TitleBoxIcon as TitleBoxIconType } from '../../../index';
import {
  TitleBoxWrapper,
  TitleBoxHeader,
  TitleBoxFooter,
  TitleBoxIcon,
} from './styled';
import { Breakpoint } from '../Breakpoint';
import { Truncate } from '@atlaskit/media-ui/truncateText';

import { formatDate } from '@atlaskit/media-ui/formatDate';

export type TitleBoxProps = {
  name: string;
  breakpoint: Breakpoint;
  createdAt?: number;
  titleBoxBgColor?: string;
  titleBoxIcon?: TitleBoxIconType;
};

type FormattedDateProps = { timestamp: number };

type WithIntlProps = {
  intl?: { locale?: string };
};

export const FormattedDate = injectIntl(
  ({ timestamp, intl }: FormattedDateProps & WithIntlProps) => {
    const { locale = 'en' } = intl || { locale: 'en' };
    return <>{formatDate(timestamp, locale)}</>;
  },
);

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
