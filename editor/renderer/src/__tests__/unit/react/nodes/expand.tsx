import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { HardBreak } from '../../../../react/nodes';
import Expand from '../../../../ui/Expand';

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

	eeTest('confluence_p2m_style_recalc_and_expand_joint_exp', {
		true: async () => {
			const { findByTestId, getByRole, queryByTestId } = render(
				<IntlProvider locale="en">
					<Expand title="Title" nodeType="expand">
						<div data-testid="children" />
					</Expand>
				</IntlProvider>,
			);

			await waitFor(() => expect(queryByTestId('children')).not.toBeInTheDocument());

			fireEvent.click(getByRole('button'));

			expect(await findByTestId('children')).toBeInTheDocument();
		},
		false: async () => {
			const { findByTestId } = render(
				<IntlProvider locale="en">
					<Expand title="Title" nodeType="expand">
						<div data-testid="children" />
					</Expand>
				</IntlProvider>,
			);

			expect(await findByTestId('children')).toBeInTheDocument();
		},
	});
});
