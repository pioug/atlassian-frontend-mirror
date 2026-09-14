/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/button';
import ButtonGroup from '@atlaskit/button/button-group';

const styles = css({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
});

function Overlay() {
	const [overlay, setOverlay] = useState<Boolean>(false);

	const overlayElement = (
		<span role="img" aria-label="Crazy face Emoji">
			🤪
		</span>
	);

	return (
		<div css={styles}>
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

export default (): React.JSX.Element => <Overlay />;
