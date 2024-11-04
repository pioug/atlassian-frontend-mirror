import React from 'react';

import { type IconProps } from '@atlaskit/icon';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import { ChatIcon } from '@atlaskit/legacy-custom-icons';

export const ChatPillIcon = (props: Omit<IconProps, 'label' | 'glyph'>) => (
	<AiChatIcon {...props} label="" LEGACY_size="small" LEGACY_fallbackIcon={ChatIcon} />
);
