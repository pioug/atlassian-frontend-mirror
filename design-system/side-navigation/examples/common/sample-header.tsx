/** @jsx jsx */
import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { type CustomItemComponentProps } from '@atlaskit/menu';

import { Header } from '../../src';

import SampleIcon from './sample-logo';

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

const ExampleHeader = () => {
	return (
		<Header
			component={Container}
			description="Next-gen service desk"
			iconBefore={<Icon label="" glyph={SampleIcon} size="medium" />}
		>
			NXTGen Industries
		</Header>
	);
};

export default ExampleHeader;
