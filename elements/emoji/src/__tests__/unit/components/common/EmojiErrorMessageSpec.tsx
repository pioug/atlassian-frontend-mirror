import React from 'react';

import { screen, within } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import EmojiErrorMessage, {
	emojiErrorMessageTestId,
} from '../../../../components/common/EmojiErrorMessage';
import { messages } from '../../../../components/i18n';
import { renderWithIntl } from '../../_testing-library';

describe('<EmojiErrorMessage />', () => {
	describe('without tooltip', () => {
		it('should use the internationalised error label for the icon when gate is enabled', () => {
			passGate('platform_ally_emoji_fixes_various');
			renderWithIntl(<EmojiErrorMessage errorStyle="chooseFile" message="Something went wrong" />);

			const errorMessage = screen.getByTestId(emojiErrorMessageTestId);
			expect(
				within(errorMessage).getByRole('img', { name: messages.error.defaultMessage }),
			).toBeInTheDocument();
		});

		it('should use the default error label for the icon when gate is disabled', () => {
			failGate('platform_ally_emoji_fixes_various');
			renderWithIntl(<EmojiErrorMessage errorStyle="chooseFile" message="Something went wrong" />);

			const errorMessage = screen.getByTestId(emojiErrorMessageTestId);
			expect(within(errorMessage).getByRole('img', { name: 'error' })).toBeInTheDocument();
		});
	});
});
