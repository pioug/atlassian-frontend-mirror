import React from 'react';

import type { MessageProps } from './message';
import { MessageWrapperContext } from './message-context';

/**
 * __Message wrapper __
 *
 * A message wrapper is used to allow assistive technologies, like screen readers, to announce error or
 * valid messages. This must be loaded into the DOM before the
 * ErrorMessage, ValidMessage is loaded. Otherwise, assistive technologies
 * may not render the message.
 *
 */
export const MessageWrapper: ({ children }: MessageProps) => JSX.Element = ({
	children,
}: MessageProps) => {
	const contextValue = {
		isWrapper: true,
	};

	return (
		<MessageWrapperContext.Provider value={contextValue}>
			<div aria-live="polite" data-testid="message-wrapper">
				{children}
			</div>
		</MessageWrapperContext.Provider>
	);
};
