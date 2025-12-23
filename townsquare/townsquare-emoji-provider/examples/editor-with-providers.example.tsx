import React from 'react';

// @ts-ignore - TS1192 TypeScript 5.9.2 upgrade
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Popup as EditorPopup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getEmojiProviderForCloudId } from '../src/provider';

import adfDoc from './__mocks__/adfDoc.json';
import emojiMockData from './__mocks__/emojiData.json';

// Unmatched routes will fallback to the network
fetchMock.config.fallbackToNetwork = true;

// Mocking the emoji API endpoint
fetchMock.mock('path:/gateway/api/emoji/standard', emojiMockData, {
	overwriteRoutes: true,
});

const mockCloudId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';
const mockUser = {
	accountId: '627bf65fa20bd0006fda4d67',
};

const emojiProvider = getEmojiProviderForCloudId(mockCloudId, mockUser.accountId);

const Editor = () => {
	const preset = createDefaultPreset({ allowAnalyticsGASV3: true }).add([
		emojiPlugin,
		{ emojiProvider },
	]);

	return <ComposableEditor preset={preset} defaultValue={adfDoc} />;
};

const styles = cssMap({
	container: {
		width: '800px',
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
	buttonGroup: {
		marginTop: token('space.100'),
	},
});

const EmojiPickerWithListener = withReactEditorViewOuterListeners(EmojiPicker);

export default function EditorWithProvidersExample(): React.JSX.Element {
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	return (
		<IntlProvider locale="en">
			<Box xcss={styles.container}>
				<Editor />

				<Box xcss={styles.buttonGroup}>
					<Button ref={buttonRef} onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
						Toggle Emoji Picker
					</Button>
					{isEmojiPickerOpen && buttonRef.current && (
						<EditorPopup
							fitHeight={350}
							fitWidth={350}
							offset={[0, 10]}
							target={buttonRef.current}
							mountTo={buttonRef.current?.parentElement ?? undefined}
							alignY="bottom"
						>
							<EmojiPickerWithListener
								handleClickOutside={() => setIsEmojiPickerOpen(false)}
								emojiProvider={emojiProvider}
								onSelection={(emojiId) => {
									alert(`Selected emoji: ${JSON.stringify(emojiId)}`);
									setIsEmojiPickerOpen(false);
								}}
							/>
						</EditorPopup>
					)}
				</Box>
			</Box>
		</IntlProvider>
	);
}
