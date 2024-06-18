/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { Header } from '@atlaskit/side-navigation';

const Container = (props: CustomItemComponentProps) => {
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <div {...props} />;
};

const ExampleHeader = () => {
	return (
		<Header
			component={Container}
			description="Next-gen service desk"
			iconBefore={<Icon label="" size="medium" />}
		>
			NXTGen Industries
		</Header>
	);
};

export default ExampleHeader;
