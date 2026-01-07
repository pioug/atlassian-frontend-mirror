import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { fireEvent, render } from '@testing-library/react';

import { HardBreak } from '../../../../react/nodes';
import Expand from '../../../../ui/Expand';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Expand', () => {
	describe('analytics', () => {
		it('should call when expanding', async () => {
			const fireAnalyticsEvent = jest.fn();
			const { findByRole } = render(
				<IntlProvider locale="en">
					<Expand title={'Cool cheese'} nodeType={'expand'} fireAnalyticsEvent={fireAnalyticsEvent}>
						<HardBreak />
					</Expand>
					,
				</IntlProvider>,
			);

			fireEvent.click(await findByRole('button'));

			expect(fireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'toggleExpand',
				actionSubject: 'expand',
				attributes: {
					platform: 'web',
					mode: 'renderer',
					expanded: true,
				},
				eventType: 'track',
			});
		});
	});
});
