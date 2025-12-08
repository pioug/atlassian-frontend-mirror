import React, { type ChangeEvent, type FC, type FormEvent, useState } from 'react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

type State = {
	inputValue: string;
	imageUrl: string;
};

const initialState = {
	inputValue: 'https://pbs.twimg.com/profile_images/568401563538841600/2eTVtXXO_400x400.jpeg',
	imageUrl: '',
};

const ExternalSrcAvatar: FC = () => {
	const [{ inputValue, imageUrl }, setState] = useState<State>(initialState);
	const [avatarKey, setAvatarKey] = useState(0);

	const changeUrl = (event: ChangeEvent<HTMLInputElement>) =>
		setState({ imageUrl, inputValue: event.target.value });

	const loadImage = (event: FormEvent) => {
		event.preventDefault();
		setState({ imageUrl: inputValue, inputValue });
	};

	const resetState = () => setState(initialState);
	const forceRemount = () => setAvatarKey((k) => k + 1);

	let avatarName = 'Default Avatar';
	if (imageUrl === initialState.inputValue) {
		avatarName = 'Mike Cannon-Brookes';
	} else if (imageUrl.length) {
		avatarName = 'Custom Avatar';
	}

	return (
		<form onSubmit={loadImage}>
			<Text size="large" color="color.text.subtle">
				Try pasting a URL to see the loading behavior:
			</Text>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					gap: token('space.100', '8px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginBottom: token('space.100', '8px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginTop: token('space.100', '8px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'end',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					justifyContent: 'center',
				}}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<label htmlFor="image-url" style={{ flexGrow: 1 }}>
					Image URL
					<Textfield
						id="image-url"
						onChange={changeUrl}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ flex: 1 }}
						value={inputValue}
					/>
				</label>
				<Box paddingBlockEnd="space.050">
					<Inline space="space.100">
						<Button type="submit" appearance="primary">
							Load Image
						</Button>
						<Button onClick={resetState}>Reset</Button>
						<Button onClick={forceRemount}>Remount</Button>
					</Inline>
				</Box>
			</div>
			<Avatar key={avatarKey} name={avatarName} size="xlarge" src={imageUrl} />
		</form>
	);
};

export default ExternalSrcAvatar;
