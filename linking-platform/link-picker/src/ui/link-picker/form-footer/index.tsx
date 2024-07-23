/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { defineMessages, type MessageDescriptor, useIntl } from 'react-intl-next';
import uuid from 'uuid';

import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	type LinkPickerPluginAction,
	type LinkPickerState,
	type LinkSearchListItemData,
} from '../../../common/types';
import { UnauthenticatedError } from '../../../common/utils/errors';

import FeatureDiscovery from './feature-discovery';
import { formFooterActionStyles, formFooterStyles } from './styled';
import { checkSubmitDisabled } from './utils';

export const messages = defineMessages({
	cancelButton: {
		id: 'fabric.linkPicker.button.cancel',
		defaultMessage: 'Cancel',
		description: 'Button to cancel and dismiss the link picker',
	},
	saveButton: {
		id: 'fabric.linkPicker.button.save',
		defaultMessage: 'Save',
		description: 'Button to save edited link',
	},
	insertButton: {
		id: 'fabric.linkPicker.button.insert',
		defaultMessage: 'Insert',
		description: 'Button to insert searched or selected link',
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
	/** Feature discovery for action button (css pulse) */
	actionButtonDiscovery: 'link-picker-action-button-discovery',
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
	createFeatureDiscovery?: boolean;
	customSubmitButtonLabel?: MessageDescriptor;
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
		createFeatureDiscovery = false,
		customSubmitButtonLabel,
		...restProps
	}: FormFooterProps) => {
		const intl = useIntl();

		const submitMessageId = useMemo(() => uuid(), []);

		if (error && error instanceof UnauthenticatedError) {
			return null;
		}

		const isSubmitDisabled = checkSubmitDisabled(
			isLoading,
			isSubmitting,
			error,
			url,
			queryState,
			items,
		);

		const insertButtonMsg = isEditing ? messages.saveButton : messages.insertButton;

		const createButton = (pluginAction: LinkPickerPluginAction) => (
			<Button
				testId={testIds.actionButton}
				onClick={pluginAction.callback}
				appearance="default"
				iconBefore={<EditorAddIcon label="" size="medium" />}
				isDisabled={isSubmitting}
				aria-labelledby={isSubmitting ? submitMessageId : undefined}
			>
				{typeof pluginAction.label === 'string'
					? pluginAction.label
					: intl.formatMessage(pluginAction.label)}
			</Button>
		);

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<footer css={formFooterStyles} {...restProps}>
				{isSubmitting && (
					<VisuallyHidden
						role="status"
						id={submitMessageId}
						testId={testIds.submitStatusA11yIndicator}
					>
						{intl.formatMessage(messages.submittingStatusMessage)}
					</VisuallyHidden>
				)}
				{action && (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={formFooterActionStyles}>
						{createFeatureDiscovery ? (
							<FeatureDiscovery testId={testIds.actionButtonDiscovery}>
								{createButton(action)}
							</FeatureDiscovery>
						) : (
							createButton(action)
						)}
					</div>
				)}
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
					<LoadingButton
						type="submit"
						appearance="primary"
						testId={testIds.insertButton}
						isDisabled={isSubmitDisabled}
						aria-labelledby={isSubmitting ? submitMessageId : undefined}
						isLoading={isSubmitting}
					>
						{customSubmitButtonLabel
							? intl.formatMessage(customSubmitButtonLabel)
							: intl.formatMessage(insertButtonMsg)}
					</LoadingButton>
				</ButtonGroup>
			</footer>
		);
	},
);
