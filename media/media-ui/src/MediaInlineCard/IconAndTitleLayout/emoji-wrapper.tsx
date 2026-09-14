import React from 'react';

import { EmojiWrapper as CompiledEmojiWrapper } from './emoji-wrapper-compiled';

export const EmojiWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledEmojiWrapper {...props} />;
