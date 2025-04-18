import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import RelatedArticlesLoading from '../../RelatedArticlesLoading';

describe('RelatedArticlesLoading', () => {
	it('Should match snapshot', () => {
		const { asFragment } = render(
			<IntlProvider locale="en">
				<RelatedArticlesLoading />
			</IntlProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
