/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
import { createIntl, createIntlCache } from 'react-intl';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { messages } from '../../../../../../messages';

import { ArticleWasHelpfulNoButton } from '../../WasHelpfulNoButton';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageNo = intl.formatMessage(messages.help_article_rating_option_no);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('ArticleContent', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />,
		);

		await expect(container).toBeAccessible();
	});

	it('Match snapshot', () => {
		const { asFragment } = render(
			<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it('props methods "onWasHelpfulNoButtonClick" and "onClick" should be executed when the user click the button', () => {
		const { getByText } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<ArticleWasHelpfulNoButton isSelected={false} onClick={mockOnClick} intl={intl} />
			</AnalyticsListener>,
		);

		const buttonNo = getByText(messageNo).closest('button');
		expect(buttonNo).not.toBeNull;

		if (buttonNo) {
			fireEvent.click(buttonNo);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
