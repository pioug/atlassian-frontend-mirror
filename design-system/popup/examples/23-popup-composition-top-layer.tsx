/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Popup, PopupContent, PopupTrigger } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	contentPadding: {
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		'@media (min-width: 48rem)': {
			width: '400px',
		},
	},
	trigger: {
		// Position the trigger away from the viewport edge so anchor positioning
		// places the popup to the right and the VR snapshot shows both elements.
		marginInlineStart: token('space.200'),
		marginBlockStart: token('space.200'),
	},
});

const PopupCompositionTopLayer = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div css={styles.trigger}>
			<Popup isOpen={isOpen} id="popup">
				<PopupTrigger>
					{(props) => (
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							data-testid="popup-trigger"
							{...props}
						>
							Open popup
						</button>
					)}
				</PopupTrigger>
				<PopupContent
					placement="right-start"
					xcss={styles.contentPadding}
					onClose={() => setIsOpen(false)}
				>
					{() => <div>Popup content with padding and fixed width</div>}
				</PopupContent>
			</Popup>
		</div>
	);
};

export default PopupCompositionTopLayer;
