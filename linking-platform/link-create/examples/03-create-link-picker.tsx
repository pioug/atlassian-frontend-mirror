import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { LinkPicker } from '@atlaskit/link-picker';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import { MockPluginForm } from '../example-helpers/mock-plugin-form';
import LinkCreate from '../src';
import { type CreatePayload } from '../src/common/types';

const ENTITY_KEY = 'object-name';

const LinkPickerCreate = () => {
	const [link, setLink] = useState<string | null>(null);
	const [showPicker, setShowPicker] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const mockPlugin = () => {
		return {
			group: {
				label: 'test',
				icon: 'test-icon',
				key: 'mock-plugin',
			},
			label: 'label',
			icon: 'icon',
			key: ENTITY_KEY,
			form: <MockPluginForm />,
		};
	};

	const createPlugins = [mockPlugin()];
	const pickerPlugins = [
		{
			resolve: () =>
				Promise.resolve({
					data: [],
				}),
			action: {
				label: 'Create New',
				callback: () => {
					setShowCreateModal(true);
				},
			},
		},
	];

	// Event handlers
	const onCancel = () => setShowPicker(false);
	const onSubmit = (payload: { url: string }) => {
		setLink(payload.url);
		console.log(payload);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: token('space.250', '20px') }}>
			{link && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ marginBottom: token('space.200', '1rem') }}>
					{fg('dst-a11y__replace-anchor-with-link__linking-platfo') ? (
						<Link href={link} target="_blank" rel="noopener noreferrer nofollow">
							{link}
						</Link>
					) : (
						// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
						<a href={link} target="_blank" rel="noopener noreferrer nofollow">
							{link}
						</a>
					)}
				</div>
			)}
			<Popup
				isOpen={showPicker}
				autoFocus={false}
				onClose={() => setShowPicker(false)}
				content={() => (
					<Fragment>
						<LinkPicker plugins={pickerPlugins} onSubmit={onSubmit} onCancel={onCancel} />
						<LinkCreate
							plugins={createPlugins}
							onCancel={() => setShowCreateModal(false)}
							onCreate={(payload: CreatePayload) => {
								setLink(payload.url);
								console.log('payload is', payload);
							}}
							onComplete={() => {
								setShowCreateModal(false);
								setShowPicker(false);
							}}
							entityKey={ENTITY_KEY}
							active={showCreateModal}
						/>
					</Fragment>
				)}
				trigger={(props) => (
					<Button {...props} appearance="primary" onClick={() => setShowPicker(!showPicker)}>
						Toggle
					</Button>
				)}
			/>
		</div>
	);
};

export default LinkPickerCreate;
