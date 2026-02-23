/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button, { ButtonGroup } from '@atlaskit/button';

const containerStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
});

function Disabled() {
	const [isDisabled, setIsDisabled] = useState(false);
	return (
		<div css={containerStyles}>
			<Button onClick={() => setIsDisabled((value) => !value)}>
				Disabled: {isDisabled ? 'true' : 'false'}
			</Button>
			<div>
				<ButtonGroup>
					<Button isDisabled={isDisabled}>{'<button>'}</Button>
					<Button isDisabled={isDisabled} href="#">
						{'<a>'}
					</Button>
					<Button isDisabled={isDisabled} component="span">
						{'<span>'}
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}

export default (): React.JSX.Element => <Disabled />;
