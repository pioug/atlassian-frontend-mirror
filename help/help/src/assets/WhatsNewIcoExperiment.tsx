import React from 'react';

import FlaskIcon from '@atlaskit/icon/core/flask';
import { token } from '@atlaskit/tokens';

import { IconWrapper } from './IconWrapper';

export default function WhatsNewIcoExperiment(): React.JSX.Element {
	return <IconWrapper Icon={FlaskIcon} appearance={token('color.icon.discovery')} />;
}
