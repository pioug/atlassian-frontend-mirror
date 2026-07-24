import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { ProjectsIcon } from '@atlaskit/logo/projects/icon';
import { TrelloIcon } from '@atlaskit/logo/trello-icon';
import { type LogoProps } from '@atlaskit/logo/types';

import type { ParentProductType } from '../types';

type ProductIconProps = {
	product?: ParentProductType;
	size?: LogoProps['size'];
};

const ProductIcon = ({ product, size = 'xsmall' }: ProductIconProps): React.JSX.Element => {
	switch (product) {
		case 'ATLAS':
			return <ProjectsIcon size={size} />;
		case 'BITBUCKET':
			return <BitbucketIcon size={size} />;
		case 'CONFLUENCE':
			return <ConfluenceIcon size={size} />;
		case 'JIRA':
			return <JiraIcon size={size} />;
		case 'TRELLO':
			return <TrelloIcon size={size} />;
		default:
			return <AtlassianIcon appearance="brand" size={size} />;
	}
};

export default ProductIcon;
