/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { css, jsx } from '@compiled/react';
import { defineMessages, type MessageDescriptor, useIntl } from 'react-intl-next';

import Button, { ButtonGroup } from '@atlaskit/button';
import NewButton from '@atlaskit/button/new';
import EditorAddIcon from '@atlaskit/icon/core/add';
import EditorAddIconLegacy from '@atlaskit/icon/glyph/editor/add';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	type LinkPickerPluginAction,
	type LinkPickerState,
	type LinkSearchListItemData,
} from '../../../common/types';
import { UnauthenticatedError } from '../../../common/utils/errors';

import { LinkPickerSubmitButton } from './link-picker-submit-button';

const formFooterStyles = css({
	display: 'flex',
	justifyContent: 'flex-end',
});

const formFooterV2Styles = css({
	display: 'flex',
	justifyContent: 'flex-end',
	paddingTop: token('space.200'),
});

const formFooterActionStyles = css({
	marginRight: 'auto',
});

export const messages = defineMessages({
	cancelButton: {
		id: 'fabric.linkPicker.button.cancel',
		defaultMessage: 'Cancel',
		description: 'Button to cancel and dismiss the link picker',
	},
	submittingStatusMessage: {
		id: 'fabric.linkPicker.status.submitting',
		defaultMessage: 'Submitting',
		description:
			'Accessibility text to indicate the form has been submitted, and submission is in-progress',
	},
});

export const testIds = {
	insertButton: 'link-picker-insert-button',
	cancelButton: 'link-picker-cancel-button',
	actionButton: 'link-picker-action-button',
	submitStatusA11yIndicator: 'link-picker-submit-status-a11y-indicator',
} as const;

interface FormFooterProps extends React.HTMLAttributes<HTMLElement> {
	/** If the results section appears to be loading, impact whether the submit button is disabled */
	isLoading: boolean;
	/** Controls showing a "submission in-progres" UX */
	isSubmitting?: boolean;
	error: unknown | null;
	url: string;
	queryState: LinkPickerState | null;
	items: LinkSearchListItemData[] | null;
	isEditing?: boolean;
	onCancel?: () => void;
	action?: LinkPickerPluginAction;
	customSubmitButtonLabel?: MessageDescriptor;
	submitMessageId?: string;
	hideSubmitButton?: boolean;
}

export const FormFooter = memo(
	({
		isLoading,
		isSubmitting = false,
		error,
		url,
		queryState,
		items,
		isEditing,
		onCancel,
		action,
		customSubmitButtonLabel,
		submitMessageId,
		hideSubmitButton,
		className,
		...restProps
	}: FormFooterProps) => {
		const intl = useIntl();

		if (error && error instanceof UnauthenticatedError) {
			return null;
		}

		const createButton = (pluginAction: LinkPickerPluginAction) =>
			fg('platform-link-picker-remove-legacy-button') ? (
				<NewButton
					testId={testIds.actionButton}
					onClick={pluginAction.callback}
					appearance="default"
					iconBefore={() => (
						<EditorAddIcon
							label=""
							LEGACY_size="medium"
							LEGACY_fallbackIcon={EditorAddIconLegacy}
							color="currentColor"
							size="small"
						/>
					)}
					isDisabled={isSubmitting}
					aria-labelledby={isSubmitting ? submitMessageId : undefined}
				>
					{typeof pluginAction.label === 'string'
						? pluginAction.label
						: intl.formatMessage(pluginAction.label)}
				</NewButton>
			) : (
				<Button
					testId={testIds.actionButton}
					onClick={pluginAction.callback}
					appearance="default"
					iconBefore={
						<EditorAddIcon
							label=""
							LEGACY_size="medium"
							LEGACY_fallbackIcon={EditorAddIconLegacy}
							color="currentColor"
							size="small"
						/>
					}
					isDisabled={isSubmitting}
					aria-labelledby={isSubmitting ? submitMessageId : undefined}
				>
					{typeof pluginAction.label === 'string'
						? pluginAction.label
						: intl.formatMessage(pluginAction.label)}
				</Button>
			);

		const ButtonComponent = fg('platform-link-picker-remove-legacy-button') ? NewButton : Button;
		return (
			<footer
				css={[
					fg('platform-linking-visual-refresh-link-picker') ? formFooterV2Styles : formFooterStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				{...restProps}
			>
				{isSubmitting && (
					<VisuallyHidden
						role="status"
						id={submitMessageId}
						testId={testIds.submitStatusA11yIndicator}
					>
						{intl.formatMessage(messages.submittingStatusMessage)}
					</VisuallyHidden>
				)}
				{action && <div css={formFooterActionStyles}>{createButton(action)}</div>}
				<ButtonGroup>
					{onCancel && (
						<ButtonComponent
							appearance="subtle"
							onClick={onCancel}
							testId={testIds.cancelButton}
							isDisabled={isSubmitting}
							aria-labelledby={isSubmitting ? submitMessageId : undefined}
						>
							{intl.formatMessage(messages.cancelButton)}
						</ButtonComponent>
					)}

					{!hideSubmitButton && (
						<LinkPickerSubmitButton
							isEditing={isEditing}
							isLoading={isLoading}
							isSubmitting={isSubmitting}
							customSubmitButtonLabel={customSubmitButtonLabel}
							error={error}
							items={items}
							queryState={queryState}
							submitMessageId={submitMessageId}
							testId={testIds.insertButton}
							url={url}
						/>
					)}
				</ButtonGroup>
			</footer>
		);
	},
);
