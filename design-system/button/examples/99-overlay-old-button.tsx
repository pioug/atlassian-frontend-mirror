/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Button, { ButtonGroup } from '../src';

function Overlay() {
	const [overlay, setOverlay] = useState<Boolean>(false);

	const overlayElement = (
		<span role="img" aria-label="Crazy face Emoji">
			🤪
		</span>
	);

	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				'> *': { marginBottom: token('space.100', '8px') },
			}}
		>
			<Button onClick={() => setOverlay((value) => !value)}>
				Use overlay: {overlay ? 'true' : 'false'}
			</Button>
			<div>
				<ButtonGroup>
					<Button overlay={overlay ? overlayElement : undefined}>{'<button>'}</Button>
					<Button overlay={overlay ? overlayElement : undefined} href="#">
						{'<a>'}
					</Button>
					<Button overlay={overlay ? overlayElement : undefined} component="span">
						{'<span>'}
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}

export default () => <Overlay />;
