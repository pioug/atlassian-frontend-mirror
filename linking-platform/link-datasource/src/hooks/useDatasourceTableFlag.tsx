import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { type CreateFlagArgs, useFlags } from '@atlaskit/flag';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { issueLikeTableMessages } from '../ui/issue-like-table/messages';

interface DatasourceTableFlagOptions {
	isFetchAction?: boolean;
	url?: string;
}

const getErrorReason = (status?: number) => {
	switch (status) {
		case 403:
			return 'access_denied';
		default:
			return 'request_failed';
	}
};

const getExecuteActionErrorMessage = (status?: number) => {
	switch (status) {
		case 403:
			return {
				title: <FormattedMessage {...issueLikeTableMessages.updateError403Title} />,
				description: <FormattedMessage {...issueLikeTableMessages.updateError403Description} />,
			};
		default:
			return {
				title: <FormattedMessage {...issueLikeTableMessages.updateErrorGenericTitle} />,
				description: <FormattedMessage {...issueLikeTableMessages.updateErrorGenericDescription} />,
			};
	}
};

const getFetchActionErrorMessage = (status?: number) => {
	switch (status) {
		default:
			return {
				title: <FormattedMessage {...issueLikeTableMessages.fetchActionErrorGenericTitle} />,
				description: (
					<FormattedMessage {...issueLikeTableMessages.fetchActionErrorGenericDescription} />
				),
			};
	}
};

export const useDatasourceTableFlag = (options?: DatasourceTableFlagOptions) => {
	const { showFlag } = useFlags();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const showErrorFlag = useCallback(
		(args?: Partial<CreateFlagArgs> & { status?: number }): void => {
			showFlag({
				icon: (
					<CrossCircleIcon spacing="spacious" label="Error" color={token('color.icon.danger')} />
				),
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				id: uuid(),
				isAutoDismiss: true,
				...(options?.isFetchAction
					? getFetchActionErrorMessage(args?.status)
					: getExecuteActionErrorMessage(args?.status)),
				...args,
			});

			fireEvent('ui.error.shown.inlineEdit', {
				reason: getErrorReason(args?.status),
			});
		},
		[fireEvent, options?.isFetchAction, showFlag],
	);

	return { showErrorFlag };
};
