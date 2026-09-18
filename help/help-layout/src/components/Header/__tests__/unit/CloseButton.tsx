/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';

import { createIntl, createIntlCache } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { messages } from '../../../../messages';
import { CloseButton } from '../../CloseButton';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageClose = intl.formatMessage(messages.help_panel_header_close);

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();

describe('BackButton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<CloseButton intl={intl} onClick={mockOnClick} />,
			</AnalyticsListener>,
		);

		await expect(container).toBeAccessible();
	});

	it('Should render correctly', async () => {
		render(<CloseButton intl={intl} onClick={mockOnClick} />);

		expect(screen.getByLabelText(messageClose)).toBeInTheDocument();
	});

	it('Should execute the prop function "mockOnClick" when the close button is clicked', async () => {
		render(
			<AnalyticsListener channel="help" onEvent={analyticsSpy}>
				<CloseButton intl={intl} onClick={mockOnClick} />,
			</AnalyticsListener>,
		);

		const buttonClose = screen.getByLabelText(messageClose).closest('button');

		expect(buttonClose).not.toBeNull();

		if (buttonClose) {
			await userEvent.click(buttonClose);
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		}
	});
});
