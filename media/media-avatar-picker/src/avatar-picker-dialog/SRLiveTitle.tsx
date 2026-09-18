import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/media-ui/messages';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import { Mode } from './types';

type SRLiveTitleProps = {
	mode: Mode;
};

export const SRLiveTitle = ({ mode }: SRLiveTitleProps): React.JSX.Element => {
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
