import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { blockOverrideCss, getCardState } from '../utils/flexible-ui';
import FlexibleCard from '../../src/view/FlexibleCard';
import { ElementName, SmartLinkTheme, TitleBlock } from '../../src/index';
import VRTestWrapper from '../utils/vr-test-wrapper';

const cardState = getCardState({
	data: {
		'@type': 'atlassian:Template',
		'atlassian:mergeSource': {
			'@type': 'Link',
			name: 'lp-flexible-smart-links',
		},
		'atlassian:mergeDestination': { '@type': 'Link', name: 'master' },
		'atlassian:state': 'open',
		'atlassian:updatedBy': { '@type': 'Person', name: 'Tweak' },
		attributedTo: [
			{ '@type': 'Person', name: 'Fluffy' },
			{ '@type': 'Person', name: 'Kirara' },
			{ '@type': 'Person', name: 'Tweak' },
		],
		'schema:commentCount': 20,
		'schema:dateCreated': '2020-02-04T12:40:12.353+0800',
		'schema:programmingLanguage': 'Javascript',
		updated: '2022-01-23T16:44:00.000+1000',
		location: {
			name: 'Location title',
			url: 'https://www.locationMcLocationton.com/foo',
		},
	},
});

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<h5>Separator</h5>
			<FlexibleCard cardState={cardState} ui={{ theme: SmartLinkTheme.Black }} url="link-url">
				<TitleBlock
					subtitle={[{ name: ElementName.CreatedBy }, { name: ElementName.ModifiedBy }]}
					text="Between text-based elements"
				/>
				<TitleBlock
					subtitle={[{ name: ElementName.CreatedBy }]}
					text="Single text-based element (omitted)"
				/>
				<TitleBlock
					subtitle={[{ name: ElementName.CreatedOn }, { name: ElementName.ModifiedOn }]}
					text="Between date-time-based elements"
				/>
				<TitleBlock
					subtitle={[{ name: ElementName.ModifiedOn }]}
					text="Single date-time-based element (omitted)"
				/>
				<TitleBlock
					subtitle={[
						{ name: ElementName.CreatedBy },
						{ name: ElementName.CreatedOn },
						{ name: ElementName.ModifiedBy },
						{ name: ElementName.ModifiedOn },
					]}
					text="Between text-based and date-time-based elements"
				/>
				<TitleBlock
					subtitle={[{ name: ElementName.SourceBranch }, { name: ElementName.TargetBranch }]}
					text="Between source branch and target branch elements"
				/>
				<TitleBlock
					subtitle={[{ name: ElementName.TargetBranch }, { name: ElementName.SourceBranch }]}
					text="Between target branch and source branch elements"
				/>
				<TitleBlock subtitle={[{ name: ElementName.Location }]} text="With link in subtitle" />
				<TitleBlock
					subtitle={[
						{ name: ElementName.AuthorGroup },
						{ name: ElementName.CreatedBy },
						{ name: ElementName.CreatedOn },
						{ name: ElementName.State },
						{ name: ElementName.ModifiedBy },
						{ name: ElementName.ModifiedOn },
						{ name: ElementName.CommentCount },
						{ name: ElementName.SourceBranch },
						{ name: ElementName.TargetBranch },
						{ name: ElementName.ProgrammingLanguage },
					]}
					text="With other element types"
				/>
			</FlexibleCard>
			<h5>Override CSS</h5>
			<FlexibleCard
				cardState={cardState}
				ui={{
					theme: SmartLinkTheme.Black,
				}}
				url="link-url"
			>
				<TitleBlock text="Override css on block" overrideCss={blockOverrideCss} />
			</FlexibleCard>
		</SmartCardProvider>
	</VRTestWrapper>
);
