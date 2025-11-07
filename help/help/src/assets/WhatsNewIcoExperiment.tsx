import React from 'react';

import LegacyFlaskIcon from '@atlaskit/legacy-custom-icons/flask-icon';
import FlaskIcon from '@atlaskit/icon/core/flask';
import { IconWrapper } from './IconWrapper';
import { P500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIcoExperiment(): React.JSX.Element {
	return (
		<IconWrapper
			Icon={FlaskIcon}
			LegacyIcon={LegacyFlaskIcon}
			appearance={token('color.icon.discovery', P500)}
		/>
	);
}
