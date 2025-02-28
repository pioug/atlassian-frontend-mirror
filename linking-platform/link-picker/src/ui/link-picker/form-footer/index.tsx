/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { css, jsx } from '@compiled/react';
import { defineMessages, type MessageDescriptor, useIntl } from 'react-intl-next';

import Button, { ButtonGroup } from '@atlaskit/button';
import EditorAddIconLegacy from '@atlaskit/icon/glyph/editor/add';
import EditorAddIcon from '@atlaskit/icon/utility/add';
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

		const createButton = (pluginAction: LinkPickerPluginAction) => (
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

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			<footer css={formFooterStyles} className={className} {...restProps}>
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
						<Button
							appearance="subtle"
							onClick={onCancel}
							testId={testIds.cancelButton}
							isDisabled={isSubmitting}
							aria-labelledby={isSubmitting ? submitMessageId : undefined}
						>
							{intl.formatMessage(messages.cancelButton)}
						</Button>
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
