import React from 'react';

import { render, screen, within } from '@testing-library/react';

import { CommentField } from '../../../components/CommentField';
import { messages } from '../../../i18n';
import { type Comment } from '../../../types';

const mockUseFormState = jest.fn().mockReturnValue({
	values: {
		users: [
			{
				id: 'user1',
				name: 'User One',
			},
		],
	},
});

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		useIntl: jest.fn().mockReturnValue({
			formatMessage: (descriptor: any) => descriptor.defaultMessage,
		}),
	};
});

jest.mock('@atlaskit/form', () => {
	return {
		...(jest.requireActual('@atlaskit/form') as any),
		useFormState: () => mockUseFormState(),
	};
});

describe('CommentField', () => {
	it('should render TextField', async () => {
		render(<CommentField />);

		const textArea = screen.getByRole('textbox', { name: messages.commentLabel.defaultMessage });

		expect(textArea).toBeVisible();
		expect(textArea).toHaveAttribute('placeholder', messages.commentPlaceholder.defaultMessage);

		await expect(document.body).toBeAccessible();
	});

	it('should set defaultValue in the comment field when provided', async () => {
		const defaultValue: Comment = {
			format: 'plain_text',
			value: 'some comment',
		};

		render(<CommentField defaultValue={defaultValue} />);

		const textArea = screen.getByRole('textbox', { name: messages.commentLabel.defaultMessage });
		const value = within(textArea).getByText('some comment');

		expect(value).toBeVisible();

		await expect(document.body).toBeAccessible();
	});

	it.each([true, false])(
		'should render textarea if extended share dialog is disabled and hasUsers = %s',
		(hasUsers) => {
			// By default mockUseFormState returns a user
			if (!hasUsers) {
				mockUseFormState.mockReturnValueOnce({
					values: {
						users: [],
					},
				});
			}
			render(<CommentField isExtendedShareDialogEnabled={false} />);
			const textArea = screen.getByRole('textbox', { name: messages.commentLabel.defaultMessage });
			expect(textArea).toBeVisible();
		},
	);

	it('should not render textarea if extended share dialog is enabled and no users are selected', async () => {
		mockUseFormState.mockReturnValueOnce({
			values: {
				users: [],
			},
		});

		render(<CommentField isExtendedShareDialogEnabled />);

		const textArea = screen.queryByRole('textbox');

		expect(textArea).not.toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should render textarea if extended share dialog is enabled and users are selected', async () => {
		render(<CommentField isExtendedShareDialogEnabled />);

		const textArea = screen.getByRole('textbox', {
			name: messages.extendedDialogCommentLabel.defaultMessage,
		});

		expect(textArea).toBeVisible();

		await expect(document.body).toBeAccessible();
	});
});
