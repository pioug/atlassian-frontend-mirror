/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

const Icon = <AtlassianIcon label="" size="small" />;

const ButtonWrapper = ({
	inline = true,
	children,
}: {
	inline?: boolean;
	children: React.ReactNode;
}) => (
	<div
		css={{
			display: inline ? 'inline-block' : 'block',
			padding: token('space.050', '4px'),
		}}
	>
		{children}
	</div>
);

const ButtonOptions = () => (
	<div>
		<ButtonWrapper>
			<Button autoFocus>Auto focused button</Button>
		</ButtonWrapper>
		<ButtonWrapper>
			<Button iconBefore={Icon}>Icon Before</Button>
		</ButtonWrapper>
		<ButtonWrapper>
			<Button iconAfter={Icon}>Icon After</Button>
		</ButtonWrapper>
		<ButtonWrapper inline={false}>
			<Button shouldFitContainer>Fit Container</Button>
		</ButtonWrapper>
	</div>
);

export default ButtonOptions;
