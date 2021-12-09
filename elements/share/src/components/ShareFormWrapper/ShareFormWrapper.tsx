import React, { ReactNode } from 'react';

import { ShareDialogWithTriggerProps } from '../../types';
import { ShareHeader } from '../ShareHeader';

import { InlineDialogContentWrapper, InlineDialogFormWrapper } from './styled';

export type ShareFormWrapperProps = Pick<
  ShareDialogWithTriggerProps,
  'shareFormTitle'
> & {
  shouldShowTitle?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
};

const ShareFormWrapper = ({
  shareFormTitle,
  shouldShowTitle,
  children = null,
  footer = null,
}: ShareFormWrapperProps) => (
  <InlineDialogContentWrapper>
    <InlineDialogFormWrapper>
      {shouldShowTitle && <ShareHeader title={shareFormTitle} />}
      {children}
    </InlineDialogFormWrapper>
    {footer}
  </InlineDialogContentWrapper>
);

export default ShareFormWrapper;
