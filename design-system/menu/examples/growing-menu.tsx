import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';

import { ButtonItem, MenuGroup, Section } from '../src';

import ImgIcon from './common/img-icon';
import MenuGroupContainer from './common/menu-group-container';
import Yeti from './icons/yeti.png';

const fullText =
	'A spacecraft is a vehicle or machine designed to fly in outer space. A type of artificial satellite, spacecraft are used for a variety of purposes.';

export default () => {
	const [textIndex, setTextIndex] = useState(-1);

	useEffect(() => {
		// Slight delay to allow the page to load.
		const id = setTimeout(() => {
			setTextIndex(0);
		}, 500);

		return () => clearTimeout(id);
	}, []);

	useEffect(() => {
		if (textIndex === -1) {
			return;
		}

		if (textIndex !== fullText.length - 1) {
			const id = setTimeout(() => {
				setTextIndex((prev) => prev + 2);
			}, 30);

			return () => clearTimeout(id);
		}
	}, [textIndex]);

	return (
		<Stack space="space.200">
			<MenuGroupContainer growing>
				<MenuGroup>
					<Section>
						<ButtonItem
							iconBefore={<ImgIcon src={Yeti} alt={'Yeti'} />}
							description={fullText.slice(0, textIndex + 12)}
						>
							Spacecraft
						</ButtonItem>
					</Section>
				</MenuGroup>
			</MenuGroupContainer>

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				<Button onClick={() => setTextIndex(0)}>Again</Button>
			</div>
		</Stack>
	);
};
