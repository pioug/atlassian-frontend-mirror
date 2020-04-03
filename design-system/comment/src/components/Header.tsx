import React, { ReactNode } from 'react';
import Lozenge from '@atlaskit/lozenge';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import {
  BulletSpacer,
  Restricted,
  RestrictedIconWrapper,
  TopItem,
  TopItemsContainer,
} from '../styled/HeaderStyles';

interface Props {
  author?: ReactNode;
  restrictedTo?: ReactNode;
  isSaving?: boolean;
  savingText?: string;
  time?: ReactNode;
  type?: string;
  edited?: ReactNode;
  isError?: boolean;
}

const HeaderItems = ({
  author,
  edited,
  isError,
  isSaving,
  restrictedTo,
  savingText,
  time,
  type,
}: Props) => {
  const restrictedElement = restrictedTo ? (
    <Restricted>
      <BulletSpacer>&bull;</BulletSpacer>
      <RestrictedIconWrapper>
        <LockFilledIcon label="" size="small" />
      </RestrictedIconWrapper>{' '}
      {restrictedTo}
    </Restricted>
  ) : null;

  const items = [
    author || null,
    type ? <Lozenge>{type}</Lozenge> : null,
    time && !isSaving && !isError ? time : null,
    edited || null,
    isSaving ? savingText : null,
    restrictedElement,
  ]
    .filter(item => !!item)
    .map((item, index) => <TopItem key={index}>{item}</TopItem>); // eslint-disable-line react/no-array-index-key

  return items.length ? <TopItemsContainer>{items}</TopItemsContainer> : null;
};

export default HeaderItems;
