import React from 'react';
import { useIntl } from 'react-intl-next';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { Mode } from './types';
import { messages } from '@atlaskit/media-ui';

type SRLiveTitleProps = {
	mode: Mode;
};

export const SRLiveTitle = ({ mode }: SRLiveTitleProps) => {
	const intl = useIntl();

	return (
		<VisuallyHidden>
			<div aria-live="polite">
				{mode === Mode.Cropping && intl.formatMessage(messages.or_select_default_avatars)}
				{mode === Mode.PredefinedAvatars &&
					intl.formatMessage(messages.select_an_avatar_from_all_defaults)}
			</div>
		</VisuallyHidden>
	);
};
