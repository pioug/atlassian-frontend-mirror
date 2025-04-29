import React from 'react';

import LinkExternalIcon from '@atlaskit/icon/core/migration/link-external--shortcut';

import { ButtonItem, Section } from '../../src';

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
