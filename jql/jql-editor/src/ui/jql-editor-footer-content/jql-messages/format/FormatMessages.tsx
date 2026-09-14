import React from 'react';

import { type ExternalMessage } from '../../../../state/types';

import { extractMessageNodes } from './extractMessageNodes';
import { MessageList } from './styled';

export const FormatMessages = ({
	messages,
}: {
	messages: ExternalMessage[];
}): React.JSX.Element | null => {
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
