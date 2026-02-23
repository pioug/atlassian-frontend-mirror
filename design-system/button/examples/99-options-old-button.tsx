/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button';
import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

const Icon = <AtlassianIcon label="" size="small" />;

const buttonWrapperStyles = css({
	display: 'inline-block',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px')
});

const blockStyles = css({
	display: 'block',
});

const ButtonWrapper = ({
	inline = true,
	children,
}: {
	inline?: boolean;
	children: React.ReactNode;
}) => (
	<div
		css={[
			buttonWrapperStyles,
			!inline && blockStyles,
		]}
	>
		{children}
	</div>
);

const ButtonOptions = (): React.JSX.Element => (
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
