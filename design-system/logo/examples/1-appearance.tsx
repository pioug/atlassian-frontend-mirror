import React from 'react';

import { Code } from '@atlaskit/code';
import { B200 } from '@atlaskit/theme/colors';

import {
	AtlasIcon,
	AtlasLogo,
	AtlassianAccessIcon,
	AtlassianAccessLogo,
	AtlassianAdminIcon,
	AtlassianAdministrationIcon,
	AtlassianAdministrationLogo,
	AtlassianAdminLogo,
	AtlassianAnalyticsIcon,
	AtlassianAnalyticsLogo,
	AtlassianIcon,
	AtlassianLogo,
	AtlassianMarketplaceIcon,
	AtlassianMarketplaceLogo,
	AtlassianStartLogo,
	BitbucketIcon,
	BitbucketLogo,
	CompassIcon,
	CompassLogo,
	ConfluenceIcon,
	ConfluenceLogo,
	GuardIcon,
	GuardLogo,
	HalpIcon,
	HalpLogo,
	JiraAlignIcon,
	JiraAlignLogo,
	JiraIcon,
	JiraLogo,
	JiraProductDiscoveryIcon,
	JiraProductDiscoveryLogo,
	JiraServiceManagementIcon,
	JiraServiceManagementLogo,
	JiraSoftwareIcon,
	JiraSoftwareLogo,
	JiraWorkManagementIcon,
	JiraWorkManagementLogo,
	LoomIcon,
	LoomLogo,
	OpsgenieIcon,
	OpsgenieLogo,
	RovoIcon,
	RovoLogo,
	StatuspageIcon,
	StatuspageLogo,
	TrelloIcon,
	TrelloLogo,
} from '../src';

const appearances = ['brand', 'neutral', 'inverse'];

const buildRows = (Logo?: any, Icon?: any, inheritSupported: boolean = true) => {
	return (
		<>
			<tr>
				<td>
					<span>
						{inheritSupported
							? 'Default (inherit behaviour - deprecated, not brand-friendly)'
							: 'New logo - inherit behaviour not supported. Appearance prop enforced'}
					</span>
				</td>
				<td>{inheritSupported && Logo && <Logo />}</td>
				<td>{inheritSupported && Icon && <Icon />}</td>
			</tr>
			{appearances.map((appearance) => {
				return (
					<tr key={appearance} style={{ background: appearance === 'inverse' ? B200 : '' }}>
						<td>
							<span>
								<Code>{appearance}</Code>
							</span>
						</td>
						<td>{Logo && <Logo appearance={appearance} />}</td>
						<td>{Icon && <Icon appearance={appearance} />}</td>
					</tr>
				);
			})}
		</>
	);
};

export default () => (
	<div>
		<table>
			<thead>
				<tr>
					<th>Appearance</th>
					<th>Logo</th>
					<th>Icon</th>
				</tr>
			</thead>
			<tbody>
				{buildRows(AtlassianLogo, AtlassianIcon)}
				{buildRows(AtlassianStartLogo)}
				{buildRows(AtlassianAnalyticsLogo, AtlassianAnalyticsIcon, false)}
				{buildRows(BitbucketLogo, BitbucketIcon)}
				{buildRows(CompassLogo, CompassIcon)}
				{buildRows(ConfluenceLogo, ConfluenceIcon)}
				{buildRows(HalpLogo, HalpIcon)}
				{buildRows(JiraAlignLogo, JiraAlignIcon)}
				{buildRows(JiraLogo, JiraIcon)}
				{buildRows(JiraProductDiscoveryLogo, JiraProductDiscoveryIcon)}
				{buildRows(JiraServiceManagementLogo, JiraServiceManagementIcon)}
				{buildRows(JiraSoftwareLogo, JiraSoftwareIcon)}
				{buildRows(JiraWorkManagementLogo, JiraWorkManagementIcon)}
				{buildRows(LoomLogo, LoomIcon)}
				{buildRows(OpsgenieLogo, OpsgenieIcon)}
				{buildRows(StatuspageLogo, StatuspageIcon)}
				{buildRows(TrelloLogo, TrelloIcon)}
				{buildRows(AtlasLogo, AtlasIcon, false)}
				{buildRows(AtlassianMarketplaceLogo, AtlassianMarketplaceIcon)}
				{buildRows(GuardLogo, GuardIcon)}
				{buildRows(RovoLogo, RovoIcon)}
				{buildRows(AtlassianAdminLogo, AtlassianAdminIcon)}
				{buildRows(AtlassianAdministrationLogo, AtlassianAdministrationIcon)}
				{buildRows(AtlassianAccessLogo, AtlassianAccessIcon)}
			</tbody>
		</table>
	</div>
);
