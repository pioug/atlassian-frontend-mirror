import React from 'react';

import { type MentionEventHandler } from '../src/types';
import debug from '../src/util/logger';

export const onMentionEvent: MentionEventHandler = (
	mentionId: string,
	text: string,
	e?: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e ? e.type : '');
