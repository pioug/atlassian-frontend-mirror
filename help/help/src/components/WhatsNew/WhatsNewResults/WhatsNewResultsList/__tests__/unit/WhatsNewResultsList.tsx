/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { getMockWhatsNewArticleItemList } from '../../../../../../util/testing/mock';

import WhatsNewResultsList from '../../WhatsNewResultsList';
import { type WhatsNewResultsList as WhatsNewResultsListInterface } from '../../model/WhatsNewResultsList';

const mockOnWhatsNewArticleItemClick = jest.fn();
const mockOnShowMoreButtonClick = jest.fn();
let WhatsNewResultsListProps: Partial<WhatsNewResultsListInterface>;

describe('WhatsNewResultsList', () => {
	beforeEach(() => {
		WhatsNewResultsListProps = {
			whatsNewArticles: getMockWhatsNewArticleItemList(10),
			onWhatsNewResultItemClick: mockOnWhatsNewArticleItemClick,
			onShowMoreButtonClick: mockOnShowMoreButtonClick,
		};
	});

	it.skip('Should match snapshot', () => {
		const { container } = render(
			<IntlProvider locale="en">
				<WhatsNewResultsList {...WhatsNewResultsListProps} />
			</IntlProvider>,
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
