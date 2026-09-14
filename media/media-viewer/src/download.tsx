import React from 'react';

import MediaButton from '@atlaskit/media-ui/MediaButton';

import { downloadIcon } from './downloadIcon';

export const DisabledToolbarDownloadButton: React.JSX.Element = (
	<MediaButton isDisabled={true} iconBefore={downloadIcon} />
);
