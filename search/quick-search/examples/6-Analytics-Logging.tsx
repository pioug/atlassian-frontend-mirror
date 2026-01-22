import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics';
import { randomJiraIconUrl, randomConfluenceIconUrl } from './utils/mockData';
import QuickSearch from '../src/components/QuickSearch';
import ResultItemGroup from '../src/components/ResultItem/ResultItemGroup';
import ObjectResult from '../src/components/Results/ObjectResult';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
	onEvent = (eventName: string, eventData: object) => {
		const event = {
			name: eventName,
			data: eventData,
		};

		console.log('Analytics Event:', event);
	};

	render() {
		return (
			<AnalyticsListener onEvent={this.onEvent} matchPrivate>
				<QuickSearch isLoading={false}>
					<div>
						<ResultItemGroup title="Object examples">
							<ObjectResult
								resultId="1"
								name="quick-search is too hilarious!"
								avatarUrl={randomJiraIconUrl()}
								objectKey="AK-007"
								containerName="Search'n'Smarts"
								analyticsData={{
									indexWithinSection: 0,
									custom: 'foo',
								}}
							/>
							<ObjectResult
								resultId="2"
								avatarUrl={randomConfluenceIconUrl()}
								name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
								containerName="Buzzfluence"
								analyticsData={{
									indexWithinSection: 1,
								}}
							/>
						</ResultItemGroup>
						<ResultItemGroup title="Containers">
							<ObjectResult
								resultId="3"
								avatarUrl={randomConfluenceIconUrl()}
								name="Prank schedule: April 2017"
								containerName="The Scream Team"
								isPrivate
							/>
						</ResultItemGroup>
					</div>
				</QuickSearch>
			</AnalyticsListener>
		);
	}
}
