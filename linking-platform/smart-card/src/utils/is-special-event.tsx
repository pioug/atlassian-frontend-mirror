import React from 'react';

import { isIframe } from './is-iframe';
import { isSpecialClick } from './is-special-click';
import { isSpecialKey } from './is-special-key';

export const isSpecialEvent = (evt: React.MouseEvent | React.KeyboardEvent): boolean =>
	evt.isDefaultPrevented() &&
	(isIframe() || isSpecialKey(evt) || isSpecialClick(evt as React.MouseEvent));
