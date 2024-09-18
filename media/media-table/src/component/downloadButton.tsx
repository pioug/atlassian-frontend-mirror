import { token } from '@atlaskit/tokens';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { N40 } from '@atlaskit/theme/colors';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '@atlaskit/media-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '../util';

interface Props {
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const MediaDownloadButton = (props: Props & WrappedComponentProps) => {
	const {
		onClick,
		intl: { formatMessage },
	} = props;

	return (
		<Button
			appearance="subtle"
			testId="download-button"
			iconAfter={<DownloadIcon color="currentColor" label={formatMessage(messages.download)} />}
			onKeyPress={(event) => event.stopPropagation()}
			onClick={(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
				analyticsEvent
					.update((payload) => ({
						...payload,
						eventType: 'ui',
						actionSubjectId: 'mediaTableDownload',
					}))
					.fire(ANALYTICS_MEDIA_CHANNEL);

				onClick(event);
			}}
			theme={(current, themeProps) => ({
				buttonStyles: {
					...current(themeProps).buttonStyles,
					minWidth: 'max-content',
					'&:hover': {
						background: token('color.background.neutral.hovered', N40),
					},
				},
				spinnerStyles: current(themeProps).spinnerStyles,
			})}
		/>
	);
};

export default injectIntl(MediaDownloadButton);
