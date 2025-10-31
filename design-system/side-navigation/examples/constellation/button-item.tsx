import React from 'react';

import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { ButtonItem, Section } from '@atlaskit/side-navigation';

const ButtonItemExample = () => {
	return (
		<div>
			<Section>
				<ButtonItem>Create page</ButtonItem>
			</Section>
			<Section>
				<ButtonItem isSelected>Selected page</ButtonItem>
			</Section>
			<Section>
				<ButtonItem description="Opens in a new window" iconAfter={<LinkExternalIcon label="" />}>
					Create article
				</ButtonItem>
			</Section>
		</div>
	);
};

export default ButtonItemExample;
