import { Box, xcss } from '@atlaskit/primitives';
import React, { type ReactNode } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { AtlassianIcon, ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import Spinner from '@atlaskit/spinner/spinner';

import { SlackIcon } from '../assets/slack';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { messages } from '../i18n';
import { type UserSource } from '../../types';
import { type ExternalUserSourcesData } from '../ExternalUserSourcesContainer';

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
	sourceType: UserSource;
	icon: ReactNode;
	label: { id: string; defaultMessage: string; description: string };
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

export const SourcesTooltipContent = ({ sources, sourcesLoading }: ExternalUserSourcesData) => {
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
