import React from 'react';

import { screen } from '@testing-library/react';
import * as sinon from 'sinon';

import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { EmojiResource } from '../../../../api/EmojiResource';
import EmojiUploadPicker from '../../../../components/common/EmojiUploadPicker';
import { EmojiCommonProvider } from '../../../../context/EmojiCommonProvider';
import { renderWithIntl } from '../../_testing-library';

it('keeps manual upload and Cancel available while AI emoji creation is credit blocked', () => {
	mockExpEnabled('confluence_ai_generated_emojis');
	const onUploadEmoji = jest.fn();
	const onUploadCancelled = jest.fn();
	renderWithIntl(
		<EmojiCommonProvider
			emojiProvider={sinon.createStubInstance(EmojiResource)}
			getAICreditStatus={() => ({
				isBlocked: true,
				renderCustomContent: () => <span>Out of Rovo credits</span>,
			})}
		>
			<EmojiUploadPicker
				contentId="page-123"
				onUploadEmoji={onUploadEmoji}
				onUploadCancelled={onUploadCancelled}
			/>
		</EmojiCommonProvider>,
	);
	expect(screen.getByRole('status')).toHaveTextContent('Out of Rovo credits');
	expect(screen.getByRole('button', { name: 'Select or drop an image' })).toBeEnabled();
	expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
	expect(onUploadEmoji).not.toHaveBeenCalled();
});
