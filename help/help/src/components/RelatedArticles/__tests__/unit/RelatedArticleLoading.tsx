import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import RelatedArticlesLoading from '../../RelatedArticlesLoading';

describe('RelatedArticlesLoading', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<RelatedArticlesLoading />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible({
			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			violationCount: 2,
		});
	});

	it('Should match snapshot', () => {
		const { asFragment } = render(
			<IntlProvider locale="en">
				<RelatedArticlesLoading />
			</IntlProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
