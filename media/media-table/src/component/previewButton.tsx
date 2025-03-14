import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import LegacyEditorFilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import EditorFilePreviewIcon from '@atlaskit/icon/core/grow-diagonal';
import Button from '@atlaskit/button';
import { messages } from '@atlaskit/media-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '../util';

interface Props {
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const MediaPreviewButton = (props: Props & WrappedComponentProps) => {
	const {
		onClick,
		intl: { formatMessage },
	} = props;

	return (
		<Button
			appearance="subtle"
			testId="preview-button"
			iconAfter={
				<EditorFilePreviewIcon
					LEGACY_fallbackIcon={LegacyEditorFilePreviewIcon}
					label={formatMessage(messages.preview)}
					color="currentColor"
				/>
			}
			onKeyPress={(event) => event.stopPropagation()}
			onClick={(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
				analyticsEvent
					.update((payload) => ({
						...payload,
						eventType: 'ui',
						actionSubjectId: 'mediaTablePreview',
					}))
					.fire(ANALYTICS_MEDIA_CHANNEL);

				onClick(event);
			}}
		/>
	);
};

export default injectIntl(MediaPreviewButton);
