import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AkFlag, { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

import { PastePluginActionTypes } from '../editor-actions/actions';
import type { PastePlugin } from '../pastePluginType';
import { FLAG_TYPE } from '../pastePluginType';
import { pluginKey } from '../pm-plugins/plugin-factory';

type Props = {
	api?: ExtractInjectionAPI<PastePlugin>;
};

export const Flag = ({ api }: Props) => {
	const { activeFlag } = useSharedPluginStateWithSelector(api, ['paste'], (states) => ({
		activeFlag: states.pasteState?.activeFlag,
	}));
	const { formatMessage } = useIntl();

	if (!activeFlag) {
		return;
	}

	const {
		type,
		onDismissed: onDismissedCallback,
		description: flagDescription,
		title: flagTitle,
		urlText: flagUrlText,
		urlHref: flagUrlHref,
	} = activeFlag;
	const description = flagDescription ? formatMessage(flagDescription) : undefined;
	const title = flagTitle ? formatMessage(flagTitle) : undefined;
	const urlText = flagUrlText ? formatMessage(flagUrlText) : undefined;

	const onDismissed = () => {
		api?.core.actions.execute(({ tr }) => {
			onDismissedCallback?.(tr);
			const oldMeta = tr.getMeta(pluginKey);
			tr.setMeta(pluginKey, {
				...oldMeta,
				type: PastePluginActionTypes.SET_ACTIVE_FLAG,
				activeFlag: false,
			});
			return tr;
		});
		api?.core.actions.focus();
	};

	const getActions = () => {
		const action =
			urlText && flagUrlHref
				? {
						content: urlText,
						href: flagUrlHref,
				  }
				: undefined;

		if (action) {
			return [
				{
					content: action.content,
					href: action.href,
					target: '_blank',
				},
			];
		}
		return undefined;
	};

	const getFlagComponent = () => {
		if (type === FLAG_TYPE.INFO || type === FLAG_TYPE.SUCCESS) {
			return AutoDismissFlag;
		}
		return AkFlag;
	};

	const FlagComponent = getFlagComponent();

	return (
		<FlagGroup>
			<FlagComponent
				onDismissed={onDismissed}
				title={title}
				description={description}
				id={activeFlag.id}
				testId={activeFlag.id}
				icon={typeToIcon(type)}
				actions={getActions()}
			/>
		</FlagGroup>
	);
};

const typeToIcon = (type: FLAG_TYPE) => {
	if (type === 'error') {
		return <StatusErrorIcon label="" color={token('color.icon.danger')} />;
	}
	if (type === 'warning') {
		return <StatusWarningIcon label="" color={token('color.icon.warning')} />;
	}
	return <StatusSuccessIcon label="" color={token('color.icon.success')} />;
};
