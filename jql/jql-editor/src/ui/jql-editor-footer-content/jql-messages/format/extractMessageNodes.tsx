import React from 'react';

import { type ExternalMessage } from '../../../../state/types';

import { MAX_MESSAGES } from './index';

/**
 * This function was extracted from FormatMessages, so that the rendering is decoupled from the logic
 * This is so that the extractMessageNodes can used elsewhere where rendering is delegated to a different renderer
 *
 * Simply put, this function only handles getting m.message, and limiting to MAX_MESSAGES
 */
export const extractMessageNodes = (messages: ExternalMessage[]): React.ReactElement[] => {
	return messages.slice(0, MAX_MESSAGES).map((m) => <>{m.message}</>);
};
