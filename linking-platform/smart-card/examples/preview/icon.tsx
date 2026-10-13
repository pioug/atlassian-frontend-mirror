import React from 'react';

import LinkIcon from '@atlaskit/icon/core/link';
import { Icon } from '@atlaskit/smart-card/icon';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<Icon icon={<LinkIcon label="" />} defaultIcon={<LinkIcon label="" />} />
		</div>
	);
}
