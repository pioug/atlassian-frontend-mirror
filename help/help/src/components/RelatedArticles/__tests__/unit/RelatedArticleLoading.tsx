import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import RelatedArticlesLoading from '../../RelatedArticlesLoading';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
