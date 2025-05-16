import React from 'react';

import { MediaContext } from './MediaProvider';

export const useMediaSettings = () => {
	const { settings } = React.useContext(MediaContext) || {};
	return settings || {};
};
