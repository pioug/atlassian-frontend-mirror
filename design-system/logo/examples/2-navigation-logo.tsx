/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import {
	AdminIcon,
	AdminIcon as AtlassianAdminIcon,
	AdminIcon as AtlassianAdministrationIcon,
} from '@atlaskit/logo/admin/icon';
import { AlignIcon } from '@atlaskit/logo/align/icon';
import {
	AnalyticsIcon,
	AnalyticsIcon as AtlassianAnalyticsIcon,
} from '@atlaskit/logo/analytics/icon';
import { ArtifactsIcon } from '@atlaskit/logo/artifacts/icon';
import { AtlassianAccessIcon } from '@atlaskit/logo/atlassian-access/icon';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianMarketplaceIcon } from '@atlaskit/logo/atlassian-marketplace/icon';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { DxIcon } from '@atlaskit/logo/dx/icon';
import { FocusIcon } from '@atlaskit/logo/focus/icon';
import { GuardIcon } from '@atlaskit/logo/guard/icon';
import { InsightsIcon } from '@atlaskit/logo/insights/icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraProductDiscoveryIcon } from '@atlaskit/logo/jira-product-discovery/icon';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { JiraWorkManagementIcon } from '@atlaskit/logo/jira-work-management/icon';
import { LoomIcon as LoomAttributionIcon, LoomIcon } from '@atlaskit/logo/loom/icon';
import { OpsgenieIcon } from '@atlaskit/logo/opsgenie-icon';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { StatuspageIcon } from '@atlaskit/logo/statuspage-icon';
import { TrelloIcon } from '@atlaskit/logo/trello-icon';
import { token } from '@atlaskit/tokens';

const logoOptions = [
	AtlassianIcon,
	AdminIcon,
	AnalyticsIcon,
	ArtifactsIcon,
	AlignIcon,
	BitbucketIcon,
	CompassIcon,
	DxIcon,
	ConfluenceIcon,
	FocusIcon,
	GuardIcon,
	InsightsIcon,
	JiraIcon,
	JiraProductDiscoveryIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	JiraWorkManagementIcon,
	LoomAttributionIcon,
	LoomIcon,
	OpsgenieIcon,
	RovoIcon,
	StatuspageIcon,
	TrelloIcon,
	AtlassianAdminIcon,
	AtlassianAdministrationIcon,
	AtlassianAnalyticsIcon,
	AtlassianAccessIcon,
	AtlassianMarketplaceIcon,
];

const iconVariants = [
	{ background: '#0747A6', color: 'white' },
	{ background: '#DFE1E6', color: '#0E1624' },
	{ background: '#6554C0', color: '#FFAB00' },
];

interface WrapperDivProps {
	color: string;
	background: string;
	children: ReactNode;
}

const wrapperDivStyles = css({
	display: 'flex',
	width: '48px',
	height: '48px',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'var(--background)',
	borderRadius: token('radius.small', '4px'),
	color: 'var(--color)',
	marginInlineEnd: token('space.250'),
});

const WrapperDiv = ({ color, background, children }: WrapperDivProps) => {
	return (
		<div
			css={wrapperDivStyles}
			style={{ '--color': color, '--background': background } as React.CSSProperties}
		>
			{children}
		</div>
	);
};

const Wrapper = (props: WrapperDivProps) => (
	<Fragment>
		<WrapperDiv color={props.color} background={props.background}>
			{props.children}
		</WrapperDiv>
		<br />
	</Fragment>
);

const _default: () => JSX.Element = () => (
	<Fragment>
		{logoOptions.map((Child, index) => (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ display: 'flex', marginBottom: token('space.250') }}
				key={index}
			>
				{iconVariants.map((pairing, index2) => (
					<Wrapper color={pairing.color} background={pairing.background} key={`${index}${index2}`}>
						<Child iconColor="inherit" />
					</Wrapper>
				))}
			</div>
		))}
	</Fragment>
);
export default _default;
