import React, { type ReactNode } from 'react';

import { FormattedMessage } from 'react-intl';

import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner/spinner';

import { type UserSource } from '../../types';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { SlackIcon } from '../assets/slack';
import { type ExternalUserSourcesData } from '../ExternalUserSourcesContainer';
import { messages } from '../i18n';

const sourcesTooltipContainer = xcss({
	paddingBottom: 'space.050',
	paddingRight: 'space.050',
});

const sourceWrapperStyles = xcss({
	paddingTop: 'space.050',
	display: 'flex',
	alignItems: 'center',
});

type RenderableSource = {
	icon: ReactNode;
	label: { defaultMessage: string; description: string; id: string };
	sourceType: UserSource;
};

const SUPPORTED_SOURCES: RenderableSource[] = [
	{
		sourceType: 'jira',
		icon: <JiraIcon size={'xxsmall'} />,
		label: messages.jiraSource,
	},
	{
		sourceType: 'confluence',
		icon: <ConfluenceIcon size={'xxsmall'} />,
		label: messages.confluenceSource,
	},
	{
		sourceType: 'other-atlassian',
		icon: <AtlassianIcon size={'xxsmall'} />,
		label: messages.otherAtlassianSource,
	},
	{ sourceType: 'slack', icon: <SlackIcon />, label: messages.slackProvider },
	{
		sourceType: 'google',
		icon: <GoogleIcon />,
		label: messages.googleProvider,
	},
	{
		sourceType: 'microsoft',
		icon: <MicrosoftIcon />,
		label: messages.microsoftProvider,
	},
];

const imageContainerStyles = xcss({
	height: '16px',
	width: '16px',
	paddingRight: 'space.050',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const SourcesTooltipContent = ({
	sources,
	sourcesLoading,
}: ExternalUserSourcesData): React.JSX.Element => {
	const sourcesToRender = React.useMemo(
		() =>
			SUPPORTED_SOURCES.filter((supportedSource) => sources.includes(supportedSource.sourceType)),
		[sources],
	);
	return (
		<React.Fragment>
			{/* If fetching fails but we have static sources, just show them instead of the error message */}
			{!sourcesLoading && sources.length === 0 ? (
				<Box as="span">
					<FormattedMessage {...messages.externalUserSourcesError} />
				</Box>
			) : (
				<React.Fragment>
					<Box as="span">
						<FormattedMessage {...messages.externalUserSourcesHeading} />
					</Box>
					<Box xcss={sourcesTooltipContainer}>
						{sourcesLoading && <Spinner size="small" appearance="invert" />}
						{!sourcesLoading &&
							sourcesToRender.map(({ sourceType, icon, label }) => (
								<Box xcss={sourceWrapperStyles} key={sourceType}>
									<Box as="span" xcss={imageContainerStyles}>
										{icon}
									</Box>
									<Box as="span">
										<FormattedMessage {...label} />
									</Box>
								</Box>
							))}
					</Box>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};
