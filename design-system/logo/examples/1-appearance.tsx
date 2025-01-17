import React from 'react';

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
	FocusIcon,
	FocusLogo,
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
	LoomAttributionIcon,
	LoomAttributionLogo,
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
} from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { B200 } from '@atlaskit/theme/colors';

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
								<Lozenge isBold>{appearance}</Lozenge>
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
				{buildRows(FocusLogo, FocusIcon)}
				{buildRows(HalpLogo, HalpIcon)}
				{buildRows(JiraAlignLogo, JiraAlignIcon)}
				{buildRows(JiraLogo, JiraIcon)}
				{buildRows(JiraProductDiscoveryLogo, JiraProductDiscoveryIcon)}
				{buildRows(JiraServiceManagementLogo, JiraServiceManagementIcon)}
				{buildRows(JiraSoftwareLogo, JiraSoftwareIcon)}
				{buildRows(JiraWorkManagementLogo, JiraWorkManagementIcon)}
				{buildRows(LoomAttributionLogo, LoomAttributionIcon)}
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
