/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Popup } from '@atlaskit/popup/compositional/popup';
import { PopupContent } from '@atlaskit/popup/compositional/popup-content';
import { PopupTrigger } from '@atlaskit/popup/compositional/popup-trigger';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const popupContentStyles = cssMap({
	root: {
		borderRadius: token('radius.small'),
		border: `${token('border.width')} solid ${token('color.border.accent.blue')}`,
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		width: '200px',
		height: '120vh',
	},
});

export default function PopupShouldFitViewportExample(): JSX.Element {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [shouldFitViewport, setShouldFitViewport] = useState(true);
	const [shouldRenderToParent, setShouldRenderToParent] = useState(true);

	return (
		<Stack space="space.200" alignInline="start">
			<Popup isOpen={isPopupOpen}>
				<PopupTrigger>
					{(props) => (
						<Button
							onClick={() => setIsPopupOpen(!isPopupOpen)}
							isSelected={isPopupOpen}
							{...props}
						>
							Popup trigger
						</Button>
					)}
				</PopupTrigger>
				<PopupContent
					onClose={() => setIsPopupOpen(false)}
					shouldFitViewport={shouldFitViewport}
					shouldRenderToParent={shouldRenderToParent}
					placement="right-start"
					testId="popup-content"
				>
					{() => <div css={popupContentStyles.root}>This popup is very tall</div>}
				</PopupContent>
			</Popup>

			<Button
				isSelected={shouldRenderToParent}
				onClick={() => setShouldRenderToParent((prev) => !prev)}
			>
				Toggle should render to parent
			</Button>

			<Button isSelected={shouldFitViewport} onClick={() => setShouldFitViewport((prev) => !prev)}>
				Toggle should fit viewport
			</Button>
		</Stack>
	);
}
