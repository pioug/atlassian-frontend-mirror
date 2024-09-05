import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';
import uuid from 'uuid';

import { type CreateFlagArgs, useFlags } from '@atlaskit/flag';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { issueLikeTableMessages } from '../ui/issue-like-table/messages';

interface DatasourceTableFlagOptions {
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

const getGenericErrorMessage = (status?: number) => {
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

export const useDatasourceTableFlag = (options?: DatasourceTableFlagOptions) => {
	const { showFlag } = useFlags();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const showErrorFlag = useCallback(
		(args?: Partial<CreateFlagArgs> & { status?: number }) => {
			showFlag({
				// We need IconTile in order to scale the new icon to 24px
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
				icon: <CrossCircleIcon label="Error" primaryColor={token('color.icon.danger')} />,
				id: uuid(),
				isAutoDismiss: true,
				...getGenericErrorMessage(args?.status),
				...args,
			});

			fireEvent('ui.error.shown.inlineEdit', {
				reason: getErrorReason(args?.status),
			});
		},
		[fireEvent, showFlag],
	);

	return { showErrorFlag };
};
