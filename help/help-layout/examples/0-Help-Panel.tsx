import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import HelpLayout from '../src/index';

import { ExampleWrapper, HelpWrapper, FooterContent, ExampleDefaultContent } from './utils/styled';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
	const { payload, context } = analyticsEvent;
	console.log('Received event:', { payload, context });
};

const Example = () => {
	return (
		<ExampleWrapper>
			<Page>
				<HelpWrapper>
					<AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
						<LocaleIntlProvider locale={'en'}>
							<HelpLayout
								headerTitle="Header Title"
								isBackbuttonVisible={true}
								onCloseButtonClick={() => console.log('close')}
								footer={
									<FooterContent>
										<span>Footer</span>
									</FooterContent>
								}
							>
								<ExampleDefaultContent>
									<span>Default content</span>
								</ExampleDefaultContent>
							</HelpLayout>
						</LocaleIntlProvider>
					</AnalyticsListener>
				</HelpWrapper>
			</Page>
		</ExampleWrapper>
	);
};

export default Example;
