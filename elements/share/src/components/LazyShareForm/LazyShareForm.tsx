/** @jsx jsx */
/** @jsxFrag */
import React from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { LoadOptions } from '@atlaskit/smart-user-picker';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { messages } from '../../i18n';
import type {
  ShareData,
  ShareDialogWithTriggerProps,
  ShareDialogWithTriggerStates,
} from '../../types';
import { INTEGRATION_MODAL_SOURCE } from '../analytics/analytics';
import { IntegrationForm, IntegrationFormProps } from '../IntegrationForm';
import { ShareForm } from '../ShareForm';
import { ShareFormWrapper } from '../ShareFormWrapper';
import { allowEmails } from '../utils';

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
  | 'orgId'
  | 'isBrowseUsersDisabled'
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
    setIsLoading: (isLoading: boolean) => void;
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
    setIsLoading,
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
    orgId,
    isBrowseUsersDisabled,
  } = props;

  const footer = (
    <div>
      {bottomMessage ? (
        <div css={{ width: `${gridSize() * 44}px` }}>{bottomMessage}</div>
      ) : null}
      {customFooter && selectedIntegration === null && (
        <div
          css={{
            margin: `0 calc(-1 * ${token(
              'space.300',
              '24px',
            )}) calc(-1 * ${token('space.200', '16px')}) calc(-1 * ${token(
              'space.300',
              '24px',
            )})`,
          }}
        >
          {customFooter}
        </div>
      )}
    </div>
  );

  React.useEffect(() => {
    setIsLoading(false);
  });

  const allowEmail = allowEmails(config);

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
        <>
          {allowEmail || !isBrowseUsersDisabled ? (
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
              orgId={orgId}
              onSubmit={onSubmit}
              onDismiss={onDismiss}
              onLinkCopy={onLinkCopy}
              onUserSelectionChange={onUserSelectionChange}
              handleCloseDialog={onDialogClose}
              onTabChange={onTabChange}
              isBrowseUsersDisabled={isBrowseUsersDisabled}
            />
          ) : (
            <p>
              <FormattedMessage {...messages.formNoPermissions} />
            </p>
          )}
        </>
      )}
    </ShareFormWrapper>
  );
}

export default LazyShareForm;
