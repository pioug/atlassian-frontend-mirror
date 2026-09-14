import React from 'react';

import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import LoadingButton from '@atlaskit/button/loading-button';

import {
	ANALYTICS_CHANNEL,
	LINK_CREATE_FORM_POST_CREATE_FIELD,
} from '../../../../common/constants';
import createEventPayload from '../../../../common/utils/analytics/analytics.codegen';
import { FormSpy } from '../../form-spy';
import { messages } from '../messages';

export const SubmitButton = (): React.JSX.Element => {
	const intl = useIntl();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { submitting } = useFormState();
	const { mutators } = useForm();

	return (
		<FormSpy>
			{({ values }) => (
				<LoadingButton
					type="submit"
					appearance="primary"
					isLoading={
						/**
						 * Should only be in a loading state if submitting is because we clicked
						 * the submit button
						 */
						submitting && values[LINK_CREATE_FORM_POST_CREATE_FIELD] === false
					}
					testId="link-create-form-button-submit"
					onClick={() => {
						createAnalyticsEvent(createEventPayload('ui.button.clicked.create', {})).fire(
							ANALYTICS_CHANNEL,
						);
						mutators.setField?.(LINK_CREATE_FORM_POST_CREATE_FIELD, false);
					}}
				>
					{intl.formatMessage(messages.create)}
				</LoadingButton>
			)}
		</FormSpy>
	);
};
