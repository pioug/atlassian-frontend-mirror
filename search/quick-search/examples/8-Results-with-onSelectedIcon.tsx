import React from 'react';
import {
	randomJiraIconUrl,
	randomConfluenceIconUrl,
	getContainerAvatarUrl,
	getPersonAvatarUrl,
} from './utils/mockData';
import QuickSearch from '../src/components/QuickSearch';
import ObjectResult from '../src/components/Results/ObjectResult';
import ContainerResult from '../src/components/Results/ContainerResult';
import PersonResult from '../src/components/Results/PersonResult';
import ResultItemGroup from '../src/components/ResultItem/ResultItemGroup';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
	render() {
		return (
			<QuickSearch isLoading={false}>
				<div>
					<ResultItemGroup title="Object examples">
						<ObjectResult
							resultId="1"
							name="quick-search is too hilarious!"
							avatarUrl={randomJiraIconUrl()}
							objectKey="AK-007"
							containerName="Search'n'Smarts"
							selectedIcon="↩️"
						/>
						<ObjectResult
							resultId="2"
							avatarUrl={randomConfluenceIconUrl()}
							name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
							containerName="Buzzfluence"
							selectedIcon="↩️"
						/>
						<ContainerResult
							resultId="3"
							avatarUrl={getContainerAvatarUrl(3)}
							name="Cargo boxes"
							subText="They're big!"
							selectedIcon="↩️"
						/>
						<ContainerResult resultId="4" isPrivate name="Private container" selectedIcon="↩️" />
						<PersonResult
							resultId="5"
							avatarUrl={getPersonAvatarUrl('qgjinn')}
							mentionName="MasterQ"
							name="Qui-Gon Jinn"
							presenceMessage="On-call"
							presenceState="offline"
							selectedIcon="↩️"
						/>
					</ResultItemGroup>
				</div>
			</QuickSearch>
		);
	}
}
