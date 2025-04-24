import React, { useCallback, useState } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { default as whiteboardSvg } from '../example-helpers/hero-image.svg';
import { MockPluginForm } from '../example-helpers/mock-plugin-form';
import LinkCreate from '../src';
import { type CreatePayload } from '../src/common/types';

const fetchMockNetworkRequest = () => {
	const search = new URLSearchParams(window.location.search);

	if (search.get('disableFetchMock') !== 'true') {
		fetchMock.get(
			'*',
			[
				{ label: 'Option 1', value: 'option-1' },
				{ label: 'Option 2', value: 'option-2' },
			],
			{
				delay: 20,
				overwriteRoutes: false,
			},
		);
	}
};

fetchMockNetworkRequest();

const ENTITY_KEY = 'object-name';

const exampleCustomPlugin = {
	group: {
		label: 'test',
		icon: 'test-icon',
		key: 'mock-plugin',
	},
	label: 'My Plugin Object',
	icon: 'icon',
	key: ENTITY_KEY,
	form: <MockPluginForm />,
};

export default function CreateBasic() {
	const [link, setLink] = useState<string | null>();
	const [ari, setAri] = useState<string | null>();
	const [active, setActive] = useState(false);
	const [showModalHero, setShowModalHero] = useState<boolean>(false);

	const handleCreate = useCallback(async (payload: CreatePayload) => {
		await new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 2000);
		});
		console.log('handleCreate payload is:', payload);
		setLink(payload.url);
		setAri(payload.ari);
	}, []);

	const handleComplete = useCallback(() => {
		setActive(false);
	}, []);

	const handleFailure = useCallback(() => {
		console.log('An error');
	}, []);

	const handleCancel = useCallback(() => {
		setActive(false);
	}, []);

	const handleCloseComplete = useCallback(() => {
		console.log('Modal closed');
	}, []);

	const handleOpenComplete = useCallback(() => {
		console.log('Modal opened');
	}, []);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: token('space.250', '20px') }}>
			{ari && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ marginBottom: token('space.400', '2rem') }}>
					<p>ARI: {ari}</p>
				</div>
			)}
			{link && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ marginBottom: token('space.200', '1rem') }}>
					<a href={link} target="_blank" rel="noopener noreferrer nofollow">
						{link}
					</a>
				</div>
			)}
			<ButtonGroup>
				<Button
					testId="link-create-show"
					appearance="primary"
					onClick={() => {
						setActive(true);
						setShowModalHero(true);
					}}
				>
					Create with Hero
				</Button>

				<Button
					testId="link-create-show"
					appearance="primary"
					onClick={() => {
						setActive(true);
						setShowModalHero(false);
					}}
				>
					Create without Hero
				</Button>
			</ButtonGroup>
			<LinkCreate
				active={active}
				plugins={[exampleCustomPlugin]}
				testId="link-create"
				triggeredFrom="example"
				entityKey={ENTITY_KEY}
				onCreate={handleCreate}
				onComplete={handleComplete}
				onFailure={handleFailure}
				onCancel={handleCancel}
				onOpenComplete={handleOpenComplete}
				onCloseComplete={handleCloseComplete}
				modalHero={showModalHero ? <ModalHero /> : undefined}
			/>
		</div>
	);
}

const ModalHero = () => {
	return (
		//  eslint-disable-next-line jsx-a11y/img-redundant-alt
		<img src={whiteboardSvg} alt="Whiteboard Image" />
	);
};
