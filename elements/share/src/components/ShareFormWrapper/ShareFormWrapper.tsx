import React, { ReactNode } from 'react';

import { InlineDialogFormWrapper, InlineDialogContentWrapper } from './styled';
import { ShareHeader } from '../ShareHeader';
import { ShareDialogWithTriggerProps } from '../../types';

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
