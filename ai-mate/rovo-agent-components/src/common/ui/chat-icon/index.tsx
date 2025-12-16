import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';

export const ChatPillIcon = (
	props: Omit<NewCoreIconProps, 'label' | 'glyph'>,
): React.JSX.Element => <AiChatIcon {...props} label="" />;
