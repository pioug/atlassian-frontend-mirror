import React from 'react';

import Flag from '@atlaskit/flag';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import InformationIconLegacy from '@atlaskit/icon/glyph/info';
import Stack from '@atlaskit/primitives/stack';
import { token } from '@atlaskit/tokens';

const description = {
	spacing: 'This icon has custom spacing but still works',
	colors: 'This icon has a color override, different from the default',
};

export default () => (
	<Stack space="space.100">
		<Flag title="Default icon" description="A default icon" id="1" testId="flag-1" />

		<h2>Various spacing</h2>
		<Flag
			title="New icon - no spacing"
			description={description.spacing}
			id="2"
			icon={<StatusInformationIcon label="" spacing="none" />}
		/>
		<Flag
			title="New icon - spacious spacing"
			description={description.spacing}
			id="3"
			icon={<StatusInformationIcon label="" spacing="spacious" />}
		/>
		<Flag
			title="Legacy icon - small size"
			description={description.spacing}
			id="4"
			icon={<InformationIconLegacy label="" size="small" />}
		/>
		<Flag
			title="Legacy icon - medium size"
			description={description.spacing}
			id="5"
			icon={<InformationIconLegacy label="" size="medium" />}
		/>
		<Flag
			title="Legacy icon - large size"
			description={description.spacing}
			id="6"
			icon={<InformationIconLegacy label="" size="large" />}
		/>
		<Flag
			title="Legacy icon - xlarge size"
			description={description.spacing}
			id="7"
			icon={<InformationIconLegacy label="" size="xlarge" />}
		/>
		<Flag
			title="Legacy icon - xlarge size"
			description={description.spacing}
			id="8"
			icon="Random element that is not an icon"
		/>

		<h2>Color overrides</h2>
		<Flag
			title="New icon - color"
			description={description.colors}
			id="9"
			icon={<StatusInformationIcon label="" color={token('color.icon.danger')} />}
		/>
		<Flag
			title="Legacy icon - color"
			description={description.colors}
			id="10"
			icon={<InformationIconLegacy label="" primaryColor={token('color.icon.danger')} />}
		/>
	</Stack>
);
