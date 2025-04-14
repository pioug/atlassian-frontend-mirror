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
	const messageNodes = extractMessageNodes(messages);

	if (messageNodes.length === 0) {
		return null;
	}

	if (messageNodes.length === 1) {
		return <span>{messageNodes[0]}</span>;
	}

	return (
		<MessageList>
			{messageNodes.map((m, i) => (
				<li key={i}>{m}</li>
			))}
		</MessageList>
	);
};

/**
 * This function was extracted from FormatMessages, so that the rendering is decoupled from the logic
 * This is so that the extractMessageNodes can used elsewhere where rendering is delegated to a different renderer
 *
 * Simply put, this function only handles getting m.message, and limiting to MAX_MESSAGES
 */
export const extractMessageNodes = (messages: ExternalMessage[]): React.ReactElement[] => {
	return messages.slice(0, MAX_MESSAGES).map((m) => <>{m.message}</>);
};
