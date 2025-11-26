import React from 'react';

import ProjectIcon from '@atlaskit/icon/core/project';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { Header } from '@atlaskit/side-navigation';

const Container = ({ children, ...props }: CustomItemComponentProps) => {
	return (
		<div
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		>
			{children}
		</div>
	);
};

const ExampleHeader = (): React.JSX.Element => {
	return (
		<Header
			component={Container}
			description="Next-gen service desk"
			iconBefore={<ProjectIcon label="" size="medium" />}
		>
			NXTGen Industries
		</Header>
	);
};

export default ExampleHeader;
