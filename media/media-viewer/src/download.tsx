import React from 'react';

import { useIntl } from 'react-intl';

import DownloadIcon from '@atlaskit/icon/core/download';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import { messages } from '@atlaskit/media-ui/messages';

import { downloadIcon } from './downloadIcon';
import { useIsInsetViewer } from './insetViewerContext';
import { ViewerIconButton } from './viewer-icon-button';

export const DisabledToolbarDownloadButton = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isInsetViewer = useIsInsetViewer();
	if (isInsetViewer) {
		return (
			<ViewerIconButton isDisabled icon={DownloadIcon} label={formatMessage(messages.download)} />
		);
	}
	return <MediaButton isDisabled={true} iconBefore={downloadIcon} />;
};
