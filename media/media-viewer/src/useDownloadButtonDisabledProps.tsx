import { useIntl } from 'react-intl';

import { type MediaClient } from '@atlaskit/media-client';
import { messages } from '@atlaskit/media-ui/messages';

export const useDownloadButtonDisabledProps: any = (mediaClient: MediaClient) => {
	const { formatMessage } = useIntl();
	const isDisabled = mediaClient.config.enforceDataSecurityPolicy;
	const tooltip = isDisabled
		? formatMessage(messages.download_disabled_security_policy)
		: undefined;

	return { isDisabled, tooltip };
};
