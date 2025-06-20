import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { cssMap, cx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import type { LoadOptions } from '@atlaskit/smart-user-picker';
import { token } from '@atlaskit/tokens';

import { messages } from '../../i18n';
import type {
	MenuType,
	ShareData,
	ShareDialogWithTriggerProps,
	ShareDialogWithTriggerStates,
} from '../../types';
import { INTEGRATION_MODAL_SOURCE } from '../analytics/analytics';
import { IntegrationForm, type IntegrationFormProps } from '../IntegrationForm';
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
	| 'productAttributes'
	| 'customHeader'
	| 'customFooter'
	| 'enableSmartUserPicker'
	| 'loggedInAccountId'
	| 'cloudId'
	| 'shareFieldsFooter'
	| 'onUserSelectionChange'
	| 'isPublicLink'
	| 'copyTooltipText'
	| 'shareIntegrations'
	| 'additionalTabs'
	| 'builtInTabContentWidth'
	| 'integrationMode'
	| 'onDialogClose'
	| 'orgId'
	| 'isBrowseUsersDisabled'
	| 'userPickerOptions'
	| 'isMenuItemSelected'
	| 'isSubmitShareDisabled'
	| 'additionalUserFields'
	| 'isExtendedShareDialogEnabled'
	| 'CustomSubmitButton'
> &
	Pick<
		ShareDialogWithTriggerStates,
		'showIntegrationForm' | 'selectedIntegration' | 'isSharing' | 'shareError' | 'defaultValue'
	> &
	Pick<IntegrationFormProps, 'Content'> & {
		// actions
		onLinkCopy: () => void;
		onDismiss: (data: ShareData) => void;
		onSubmit: (data: ShareData) => void;
		onTabChange: (index: number) => void;
		onMenuItemChange: (menuType: MenuType) => void;
		loadOptions?: LoadOptions;

		// ref
		selectPortalRef: any;

		// others
		showTitle: boolean;
		setIsLoading: (isLoading: boolean) => void;
	};

const styles = cssMap({
	footerBottomMessageStyles: {
		width: '352px',
	},
	footerCustomStyles: {
		marginTop: '0',
		marginRight: token('space.negative.300', '-24px'),
		marginBottom: token('space.negative.200', '-16px'),
		marginLeft: token('space.negative.300', '-24px'),
	},
	headerCustomStyles: {
		marginBottom: token('space.200', '16px'),
	},
});

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
		productAttributes,
		customHeader,
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
		additionalTabs,
		builtInTabContentWidth,
		isMenuItemSelected,
		// actions
		onLinkCopy,
		onDismiss,
		onSubmit,
		onDialogClose,
		onTabChange,
		onMenuItemChange,
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
		userPickerOptions,
		isSubmitShareDisabled,
		additionalUserFields,
		isExtendedShareDialogEnabled,
		CustomSubmitButton,
	} = props;

	const header = customHeader ? <Box xcss={styles.headerCustomStyles}>{customHeader}</Box> : null;

	const footer = (
		<div>
			{bottomMessage ? (
				<Box xcss={cx(styles.footerBottomMessageStyles)}>{bottomMessage}</Box>
			) : null}
			{customFooter && selectedIntegration === null && (
				<Box xcss={cx(styles.footerCustomStyles)}>{customFooter}</Box>
			)}
		</div>
	);

	React.useEffect(() => {
		setIsLoading(false);
	});

	const allowEmail = allowEmails(config);

	return (
		<ShareFormWrapper
			header={header}
			footer={footer}
			// form title will be determined by `title` and `showTitle` prop passed to `ShareForm`,
			// so we don't need to show title via ShareFormWrapper
			integrationMode={integrationMode}
			isMenuItemSelected={isMenuItemSelected}
			shouldShowTitle={false}
			isExtendedShareDialogEnabled={isExtendedShareDialogEnabled}
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
							productAttributes={productAttributes}
							enableSmartUserPicker={enableSmartUserPicker}
							loggedInAccountId={loggedInAccountId}
							cloudId={cloudId}
							fieldsFooter={shareFieldsFooter}
							selectPortalRef={selectPortalRef}
							copyTooltipText={copyTooltipText}
							integrationMode={integrationMode}
							shareIntegrations={shareIntegrations}
							additionalTabs={additionalTabs}
							builtInTabContentWidth={builtInTabContentWidth}
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
							onMenuItemChange={onMenuItemChange}
							isBrowseUsersDisabled={isBrowseUsersDisabled}
							userPickerOptions={userPickerOptions}
							isSubmitShareDisabled={isSubmitShareDisabled}
							additionalUserFields={additionalUserFields}
							isExtendedShareDialogEnabled={isExtendedShareDialogEnabled}
							CustomSubmitButton={CustomSubmitButton}
						/>
					) : (
						<Text as="p">
							<FormattedMessage {...messages.formNoPermissions} />
						</Text>
					)}
				</>
			)}
		</ShareFormWrapper>
	);
}

export default LazyShareForm;
