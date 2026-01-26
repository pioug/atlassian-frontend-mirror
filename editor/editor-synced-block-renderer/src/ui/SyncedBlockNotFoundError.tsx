import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';


type ErrorInfo = {
	description: MessageDescriptor;
	icon?: (props: NewCoreIconProps) => JSX.Element;
};
const errorMap: Record<string, ErrorInfo> = {
	'source-block-unsynced': {
		description: messages.sourceUnsyncedDescription,
		icon: LinkBrokenIcon,
	},
	'source-block-deleted': {
		description: messages.sourceDeletedDescription,
		icon: LinkBrokenIcon,
	},
};

export const SyncedBlockNotFoundError = ({
	reason = 'source-block-deleted',
}: {
	reason?: string;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	let errorInfo: ErrorInfo = { description: messages.notFoundDescription };
	if (fg('platform_synced_block_dogfooding')) {
		errorInfo = errorMap[reason] ?? {};
	}

	const { description, icon } = errorInfo;

	return <SyncedBlockErrorStateCard description={formatMessage(description)} icon={icon} />;
};
