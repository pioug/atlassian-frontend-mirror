/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Popup, PopupContent, PopupTrigger } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	padding: {
		padding: token('space.100'),
	},
	longContent: {
		height: '1000px',
	},
});

const ModalPopupCompositionalAPI = () => {
	return (
		<Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<Popup isOpen>
				<PopupTrigger>{() => null}</PopupTrigger>
				<PopupContent xcss={styles.padding} appearance="UNSAFE_modal-below-sm">
					{() => <div>Hello world</div>}
				</PopupContent>
			</Popup>
		</Fragment>
	);
};

export const ModalPopupCompositionalAPILong = () => {
	return (
		<Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<Popup isOpen>
				<PopupTrigger>{() => null}</PopupTrigger>
				<PopupContent xcss={styles.padding} appearance="UNSAFE_modal-below-sm">
					{() => <div css={styles.longContent}>Hello world</div>}
				</PopupContent>
			</Popup>
		</Fragment>
	);
};

export default ModalPopupCompositionalAPI;
