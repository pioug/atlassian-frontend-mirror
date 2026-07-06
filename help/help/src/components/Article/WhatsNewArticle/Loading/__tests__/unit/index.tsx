/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
import { render } from '@testing-library/react';
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

	it('Should match snapshot', () => {
		const { asFragment } = render(<Loading intl={intl} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('Should display Loading component', () => {
		const { queryByLabelText } = render(<Loading intl={intl} />);

		const loadingImg = queryByLabelText(messageLoading);

		expect(loadingImg).not.toBeNull();
	});
});
