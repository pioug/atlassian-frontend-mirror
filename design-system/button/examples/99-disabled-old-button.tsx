/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

function Disabled() {
	const [isDisabled, setIsDisabled] = useState(false);
	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				'> *': { marginBottom: token('space.100', '8px') },
			}}
		>
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
