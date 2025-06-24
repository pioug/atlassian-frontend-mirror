import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getContext } from '../../../../../../../examples/utils/flexible-ui';
import { FlexibleCardContext } from '../../../../../../state/flexible-ui-context';
import OwnedByElement from '../index';

describe('OwnedByElement', () => {
	const testId = 'smart-element-text';
	const context = getContext({
		ownedBy: 'Angie',
	});

	ffTest.on(
		'platform-linking-flexible-card-context',
		'FG platform-linking-flexible-card-context on',
		() => {
			it('should render element', async () => {
				render(
					<IntlProvider locale="en">
						<FlexibleCardContext.Provider value={{ data: context }}>
							<OwnedByElement testId={testId} />
						</FlexibleCardContext.Provider>
					</IntlProvider>,
				);
				const element = await screen.findByTestId(testId);
				expect(element).toBeVisible();
				expect(element?.textContent).toBe('Owned by Angie');
			});

			ffTest.on(
				'bandicoots-smart-card-teamwork-context',
				'FG bandicoots-smart-card-teamwork-context on',
				() => {
					it('should render text prefix', async () => {
						render(
							<IntlProvider locale="en">
								<FlexibleCardContext.Provider value={{ data: context }}>
									<OwnedByElement testId={testId} textPrefix="TextPrefix" />
								</FlexibleCardContext.Provider>
							</IntlProvider>,
						);
						const element = await screen.findByTestId(testId);
						expect(element).toBeVisible();
						expect(element?.textContent).toBe('Owned by TextPrefix Angie');
					});

					ffTest.on(
						'platform-linking-additional-flexible-element-props',
						'FG platform-linking-additional-flexible-element-props on',
						() => {
							it('should render text prefix with hideFormat', async () => {
								render(
									<IntlProvider locale="en">
										<FlexibleCardContext.Provider value={{ data: context }}>
											<OwnedByElement testId={testId} textPrefix="TextPrefix" hideFormat />
										</FlexibleCardContext.Provider>
									</IntlProvider>,
								);
								const element = await screen.findByTestId(testId);
								expect(element).toBeVisible();
								expect(element?.textContent).toBe('TextPrefix Angie');
							});
						},
					);
				},
			);

			ffTest.off(
				'bandicoots-smart-card-teamwork-context',
				'FG bandicoots-smart-card-teamwork-context off',
				() => {
					it('should not render text prefix with FG off', async () => {
						render(
							<IntlProvider locale="en">
								<FlexibleCardContext.Provider value={{ data: context }}>
									<OwnedByElement testId={testId} textPrefix="TextPrefix" />
								</FlexibleCardContext.Provider>
							</IntlProvider>,
						);
						const element = await screen.findByTestId(testId);
						expect(element).toBeVisible();
						expect(element?.textContent).toBe('Owned by Angie');
					});
				},
			);
		},
	);
});
