import React from 'react';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { createIntl, createIntlCache } from 'react-intl';

import { messages } from '../../../../../../messages';

import { Loading } from '../../index';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageLoading = intl.formatMessage(messages.help_loading);

describe('ArticleContent', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Loading intl={intl} />);

		await expect(container).toBeAccessible();
	});

	it('Should render the loading state', () => {
		render(<Loading intl={intl} />);

		expect(screen.getByLabelText(messageLoading)).toBeInTheDocument();
	});

	it('Should display Loading component', () => {
		render(<Loading intl={intl} />);

		const loadingImg = screen.queryByLabelText(messageLoading);

		expect(loadingImg).not.toBeNull();
	});
});
