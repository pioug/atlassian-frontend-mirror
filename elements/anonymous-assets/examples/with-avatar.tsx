/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { type AnonymousAsset, getAnonymousAvatarWithStyling } from '../src';
import { ANONYMOUS_ASSETS } from '../src/common/utils/anonymous-assets';

const getRandomHexColor = () => {
	const hex = Math.floor(Math.random() * 0xffffff).toString(16);
	return `#${hex.padStart(6, '0')}`;
};

export default () => {
	const [asset, setAsset] = useState<AnonymousAsset>();
	const [index, setIndex] = useState(0);
	const [bgColor, setBgColor] = useState<string>('orange');

	const loadAsset = (index: number, bgColor: string) => {
		getAnonymousAvatarWithStyling({
			index,
			styleProperties: {
				'background-color': token('color.border.accent.orange', bgColor),
			},
		}).then((anonymousAsset) => setAsset(anonymousAsset));
	};

	const onClickChangeAsset = useCallback(() => {
		const index = Math.floor(Math.random() * ANONYMOUS_ASSETS.length);
		setIndex(index);
		loadAsset(index, bgColor);
	}, [bgColor]);

	const onClickChangeBackgroundColor = useCallback(() => {
		const color = getRandomHexColor();
		setBgColor(color);
		loadAsset(index, color);
	}, [index]);

	useEffect(() => {
		loadAsset(0, bgColor);
	}, []);

	return (
		<div>
			<ButtonGroup>
				<Button onClick={onClickChangeAsset}>Change Avatar</Button>
				<Button onClick={onClickChangeBackgroundColor}>Change Color</Button>
			</ButtonGroup>
			<div style={{ marginTop: '1%' }}>
				<Avatar size="large" src={asset?.src} borderColor="white" name={asset?.name} />
			</div>
		</div>
	);
};
