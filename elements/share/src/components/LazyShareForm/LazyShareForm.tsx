import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { LoadOptions } from '@atlaskit/user-picker';

import type {
  ShareData,
  ShareDialogWithTriggerProps,
  ShareDialogWithTriggerStates,
} from '../../types';
import { INTEGRATION_MODAL_SOURCE } from '../analytics';
import { IntegrationForm, IntegrationFormProps } from '../IntegrationForm';
import { ShareForm } from '../ShareForm';
import { ShareFormWrapper } from '../ShareFormWrapper';

import { BottomMessageWrapper, CustomFooterWrapper } from './styled';

export type LazyShareFormProps = Pick<
  ShareDialogWithTriggerProps,
  | 'copyLink'
  | 'config'
  | 'isFetchingConfig'
  | 'loadUserOptions'
  | 'shareFormTitle'
  | 'shareFormHelperMessage'
  | 'bottomMessage'
  | 'submitButtonLabel'
  | 'product'
  | 'customFooter'
  | 'enableSmartUserPicker'
  | 'loggedInAccountId'
  | 'cloudId'
  | 'shareFieldsFooter'
  | 'onUserSelectionChange'
  | 'isPublicLink'
  | 'copyTooltipText'
  | 'shareIntegrations'
  | 'integrationMode'
  | 'onDialogClose'
> &
  Pick<
    ShareDialogWithTriggerStates,
    | 'showIntegrationForm'
    | 'selectedIntegration'
    | 'isSharing'
    | 'shareError'
    | 'defaultValue'
  > &
  Pick<IntegrationFormProps, 'Content'> & {
    // actions
    onLinkCopy: () => void;
    onDismiss: (data: ShareData) => void;
    onSubmit: (data: ShareData) => void;
    onTabChange: (index: number) => void;
    loadOptions?: LoadOptions;

    // ref
    selectPortalRef: any;

    // others
    showTitle: boolean;
  };

/**
 * A Share form content which is lazy-loaded.
 * Make sure this component is not exported inside main entry points `src/index.ts`
 */
function LazyShareForm(props: LazyShareFormProps) {
  const {
    copyLink,
    config,
    isFetchingConfig,
    loadOptions,
    shareFormTitle,
    shareFormHelperMessage,
    bottomMessage,
    submitButtonLabel,
    product,
    customFooter,
    enableSmartUserPicker,
    loggedInAccountId,
    cloudId,
    shareFieldsFooter,
    onUserSelectionChange,
    isPublicLink,
    copyTooltipText,
    shareIntegrations,
    integrationMode,
    // actions
    onLinkCopy,
    onDismiss,
    onSubmit,
    onDialogClose,
    onTabChange,
    // ref
    selectPortalRef,
    // props from states of parent:
    showIntegrationForm,
    selectedIntegration,
    isSharing,
    shareError,
    defaultValue,
    showTitle,
  } = props;

  const footer = (
    <div>
      {bottomMessage ? (
        <BottomMessageWrapper>{bottomMessage}</BottomMessageWrapper>
      ) : null}
      {customFooter && selectedIntegration === null && (
        <CustomFooterWrapper>{customFooter}</CustomFooterWrapper>
      )}
    </div>
  );

  return (
    <ShareFormWrapper
      footer={footer}
      // form title will be determined by `title` and `showTitle` prop passed to `ShareForm`,
      // so we don't need to show title via ShareFormWrapper
      shouldShowTitle={false}
    >
      {showIntegrationForm && selectedIntegration !== null ? (
        <AnalyticsContext data={{ source: INTEGRATION_MODAL_SOURCE }}>
          <IntegrationForm
            Content={selectedIntegration.Content}
            onIntegrationClose={onDialogClose}
          />
        </AnalyticsContext>
      ) : (
        <ShareForm
          copyLink={copyLink}
          loadOptions={loadOptions}
          title={shareFormTitle}
          showTitle={showTitle}
          helperMessage={shareFormHelperMessage}
          shareError={shareError}
          defaultValue={defaultValue}
          config={config}
          submitButtonLabel={submitButtonLabel}
          product={product}
          enableSmartUserPicker={enableSmartUserPicker}
          loggedInAccountId={loggedInAccountId}
          cloudId={cloudId}
          fieldsFooter={shareFieldsFooter}
          selectPortalRef={selectPortalRef}
          copyTooltipText={copyTooltipText}
          integrationMode={integrationMode}
          shareIntegrations={shareIntegrations}
          isSharing={isSharing}
          isFetchingConfig={isFetchingConfig}
          isPublicLink={isPublicLink}
          onSubmit={onSubmit}
          onDismiss={onDismiss}
          onLinkCopy={onLinkCopy}
          onUserSelectionChange={onUserSelectionChange}
          handleCloseDialog={onDialogClose}
          onTabChange={onTabChange}
        />
      )}
    </ShareFormWrapper>
  );
}

export default LazyShareForm;
