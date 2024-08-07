/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Box, xcss } from '@atlaskit/primitives';
import React, { type ReactNode } from 'react';
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { AtlassianIcon, ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import Spinner from '@atlaskit/spinner/spinner';
import { token } from '@atlaskit/tokens';

import { SlackIcon } from '../assets/slack';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { messages } from '../i18n';
import { type UserSource } from '../../types';
import { type ExternalUserSourcesData } from '../ExternalUserSourcesContainer';
import { imageContainer } from './main';

const sourcesTooltipContainer = xcss({
	paddingBottom: 'space.050',
	paddingRight: 'space.050',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sourceWrapper = css({
	paddingTop: token('space.050', '4px'),
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
		icon: <JiraIcon size={'xsmall'} />,
		label: messages.jiraSource,
	},
	{
		sourceType: 'confluence',
		icon: <ConfluenceIcon size={'xsmall'} />,
		label: messages.confluenceSource,
	},
	{
		sourceType: 'other-atlassian',
		icon: <AtlassianIcon size={'xsmall'} />,
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

export const SourcesTooltipContent: React.FC<ExternalUserSourcesData> = ({
	sources,
	sourcesLoading,
}) => {
	const sourcesToRender = React.useMemo(
		() =>
			SUPPORTED_SOURCES.filter((supportedSource) => sources.includes(supportedSource.sourceType)),
		[sources],
	);
	return (
		<React.Fragment>
			{/* If fetching fails but we have static sources, just show them instead of the error message */}
			{!sourcesLoading && sources.length === 0 ? (
				<span>
					<FormattedMessage {...messages.externalUserSourcesError} />
				</span>
			) : (
				<React.Fragment>
					<span>
						<FormattedMessage {...messages.externalUserSourcesHeading} />
					</span>
					<Box xcss={sourcesTooltipContainer}>
						{sourcesLoading && <Spinner size="small" appearance="invert" />}
						{!sourcesLoading &&
							sourcesToRender.map(({ sourceType, icon, label }) => (
								<div css={sourceWrapper} key={sourceType}>
									{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
									<span css={imageContainer}>{icon}</span>
									<span>
										<FormattedMessage {...label} />
									</span>
								</div>
							))}
					</Box>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};
