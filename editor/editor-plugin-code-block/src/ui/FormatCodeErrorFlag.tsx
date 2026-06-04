import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AkFlag, { FlagGroup } from '@atlaskit/flag';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { token } from '@atlaskit/tokens';

import type { CodeBlockPlugin } from '../index';
import { ACTIONS } from '../pm-plugins/actions';
import type { FormatCodeErrorState } from '../pm-plugins/main-state';
import { pluginKey } from '../pm-plugins/plugin-key';

const FormatCodeErrorFlagItem = ({
	formatCodeError,
}: {
	formatCodeError: FormatCodeErrorState;
}) => {
	const { formatMessage } = useIntl();

	return (
		<AkFlag
			description={formatMessage(
				formatCodeError.languageSource === 'auto-detected'
					? codeBlockButtonMessages.formatCodeFailedAutoDetectedDescription
					: codeBlockButtonMessages.formatCodeFailedDescription,
			)}
			icon={<StatusErrorIcon color={token('color.icon.danger')} label="" />}
			id={formatCodeError.localId}
			title={formatMessage(codeBlockButtonMessages.formatCodeFailed)}
		/>
	);
};

export const FormatCodeErrorFlag = ({
	api,
}: {
	api?: ExtractInjectionAPI<CodeBlockPlugin>;
}): React.JSX.Element | null => {
	const { formatCodeErrors } = useSharedPluginStateWithSelector(api, ['codeBlock'], (states) => ({
		formatCodeErrors: states.codeBlockState?.formatCodeErrors ?? {},
	}));

	const onDismissed = useCallback(
		(localId: string) => {
			api?.core?.actions.execute(({ tr }) => {
				tr.setMeta(pluginKey, {
					type: ACTIONS.CLEAR_FORMAT_CODE_ERROR,
					data: { localId },
				});
				return tr;
			});
			api?.core?.actions.focus();
		},
		[api],
	);
	const onFlagGroupDismissed = useCallback(
		(localId: number | string) => onDismissed(String(localId)),
		[onDismissed],
	);

	const activeFormatCodeErrors = Object.values(formatCodeErrors);

	if (activeFormatCodeErrors.length === 0) {
		return null;
	}

	return (
		<FlagGroup onDismissed={onFlagGroupDismissed}>
			{activeFormatCodeErrors.map((formatCodeError) => (
				<FormatCodeErrorFlagItem
					formatCodeError={formatCodeError}
					key={formatCodeError.localId}
				/>
			))}
		</FlagGroup>
	);
};
