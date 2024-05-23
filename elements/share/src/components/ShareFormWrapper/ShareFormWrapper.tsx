import React, { type ReactNode } from 'react';

import { useIntl } from 'react-intl-next';

import { messages } from '../../i18n';
import { type ShareDialogWithTriggerProps } from '../../types';
import { type IntegrationMode } from '../../types/ShareEntities';
import { ShareHeader } from '../ShareHeader';

import { InlineDialogContentWrapper, InlineDialogFormWrapper } from './styled';


export type ShareFormWrapperProps = Pick<
  ShareDialogWithTriggerProps,
  'shareFormTitle'
> & {
  shouldShowTitle?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  integrationMode?: IntegrationMode;
  isMenuItemSelected?: boolean;
};

const ShareFormWrapper = ({
  shareFormTitle,
  shouldShowTitle,
  children = null,
  footer = null,
  integrationMode = 'off',
  isMenuItemSelected = false,
}: ShareFormWrapperProps) => {
  const { formatMessage } = useIntl();

  return (
    <InlineDialogContentWrapper label={formatMessage(messages.formTitle)}>
      <InlineDialogFormWrapper
        integrationMode={integrationMode}
        isMenuItemSelected={isMenuItemSelected}
      >
        {shouldShowTitle && <ShareHeader title={shareFormTitle} />}
        {children}
      </InlineDialogFormWrapper>
      {footer}
    </InlineDialogContentWrapper>
  );
};

export default ShareFormWrapper;
