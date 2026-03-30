import React from 'react';

import FlaskIcon from '@atlaskit/icon/core/flask';
import { IconWrapper } from './IconWrapper';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIcoExperiment(): React.JSX.Element {
	return <IconWrapper Icon={FlaskIcon} appearance={token('color.icon.discovery')} />;
}
