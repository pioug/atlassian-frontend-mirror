import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { token } from '@atlaskit/tokens';

import Flag from '../../src';

const FlagDefaultExample = () => {
	return (
		<Flag
			icon={<InfoIcon primaryColor={token('color.icon.information')} label="Info" />}
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			id="1"
			key="1"
			title="New version published"
		/>
	);
};

export default FlagDefaultExample;
