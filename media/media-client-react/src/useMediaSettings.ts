import React from 'react';

import { MediaContext } from './MediaProvider';
import type { MediaParsedSettings } from './mediaSettings/mediaParsedSettings';

export const useMediaSettings = (): MediaParsedSettings => {
	const { settings } = React.useContext(MediaContext) || {};
	return settings || {};
};
