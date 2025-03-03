/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives';
import type { LoadOptions } from '@atlaskit/smart-user-picker';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
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

const footerBottomMessageStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${gridSize() * 44}px`,
});

const footerCustomStyles = css({
	margin: `0 ${token('space.negative.300', '-24px')} ${token(
		'space.negative.200',
		'-16px',
	)} ${token('space.negative.300', '-24px')}`,
});

const headerCustomStyles = css({
	marginBottom: `${token('space.200', '16px')}`,
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
	} = props;

	const header = customHeader ? <div css={headerCustomStyles}>{customHeader}</div> : null;

	const footer = (
		<div>
			{bottomMessage ? <div css={footerBottomMessageStyles}>{bottomMessage}</div> : null}
			{customFooter && selectedIntegration === null && (
				<div css={footerCustomStyles}>{customFooter}</div>
			)}
		</div>
	);

	React.useEffect(() => {
		setIsLoading(false);
	});

	const allowEmail = allowEmails(config);

	return (
		<ShareFormWrapper
			header={fg('platform_share_custom_header_prop') && header}
			footer={footer}
			// form title will be determined by `title` and `showTitle` prop passed to `ShareForm`,
			// so we don't need to show title via ShareFormWrapper
			integrationMode={integrationMode}
			isMenuItemSelected={isMenuItemSelected}
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
