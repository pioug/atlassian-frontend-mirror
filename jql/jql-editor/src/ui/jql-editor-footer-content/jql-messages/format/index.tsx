import React from 'react';

import { useEditorThemeContext } from '../../../../hooks/use-editor-theme';
import { type ExternalMessage } from '../../../../state/types';

import { MessageContainer as MessageContainerStyled, MessageList } from './styled';

// Max number messages we want to show
const MAX_MESSAGES = 10;

export const MessageContainer = ({ children }: { children: React.ReactNode }) => {
	const { isSearch } = useEditorThemeContext();

	return <MessageContainerStyled isSearch={isSearch}>{children}</MessageContainerStyled>;
};

export const FormatMessages = ({ messages }: { messages: ExternalMessage[] }) => {
	if (messages.length === 0) {
		return null;
	}

	if (messages.length === 1) {
		return <span>{messages[0].message}</span>;
	}

	return (
		<MessageList>
			{messages.slice(0, MAX_MESSAGES).map((m, i) => (
				<li key={i}>{m.message}</li>
			))}
		</MessageList>
	);
};
