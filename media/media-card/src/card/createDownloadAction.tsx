import React from 'react';
import { type MessageDescriptor } from 'react-intl';

import DownloadIcon from '@atlaskit/icon/core/download';
import { messages } from '@atlaskit/media-ui/messages';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { CardAction } from './actions';

type FormatMessageFn = (descriptor: MessageDescriptor) => string;

export const createDownloadAction = (
	baseAction: CardAction,
	formatMessage: FormatMessageFn,
): CardAction => {
	const { isDisabled } = baseAction;
	const label = isDisabled ? 'Download Disabled' : 'Download';
	const tooltip = isDisabled
		? formatMessage(messages.download_disabled_security_policy)
		: undefined;

	return {
		...baseAction,
		label,
		tooltip,
		icon: (
			<DownloadIcon
				color={isDisabled ? token('color.icon.disabled') : 'currentColor'}
				spacing="spacious"
				label={fg('platform-a11y-media-card-download-icon-decorative') ? '' : 'Download'}
			/>
		),
	};
};
