/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Popup } from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	padding: {
		padding: token('space.100'),
	},
	longContent: {
		height: '1000px',
	},
});

const ModalPopupClassicAPI = () => {
	return (
		<Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<Popup
				xcss={styles.padding}
				appearance="UNSAFE_modal-below-sm"
				isOpen
				trigger={() => null}
				content={() => <div>Hello world</div>}
			/>
		</Fragment>
	);
};

export const ModalPopupClassicAPILong = () => {
	return (
		<Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<Popup
				xcss={styles.padding}
				appearance="UNSAFE_modal-below-sm"
				isOpen
				trigger={() => null}
				content={() => <div css={styles.longContent}>Hello world</div>}
			/>
		</Fragment>
	);
};

export default ModalPopupClassicAPI;
