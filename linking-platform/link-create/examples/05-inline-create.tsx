import React, { useCallback, useMemo, useState } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MockDisclaimer } from '../example-helpers/mock-disclaimer';
import {
	AsyncSelect,
	CreateForm,
	LinkCreateExitWarningProvider,
	TextField,
	useLinkCreateCallback,
	useWithExitWarning,
	type Validator,
} from '../src';
import { type CreatePayload } from '../src/common/types';
import { InlineCreate } from '../src/ui';

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

function ExampleCustomPluginForm() {
	const { onCreate, onCancel } = useLinkCreateCallback();

	type MockOptions = {
		label: string;
		value: string;
	};

	type MockedFormData = {
		textFieldName?: string | undefined;
		asyncSelectName?: MockOptions | null;
	};

	const mockHandleSubmit = async () => {
		if (onCreate) {
			await onCreate({
				url: 'https://atlassian.com/product/new-object-id',
				objectId: 'new-object-id',
				objectType: 'object-type',
				data: {},
				ari: 'example-ari',
			});
		}
	};

	const mockValidator: Validator = useMemo(
		() => ({
			isValid: (val: unknown) => !!val,
			errorMessage: 'Validation Error: You need to provide a value.',
		}),
		[],
	);

	/**
	 * Must be stable callback otherwise re-render will trigger re-fetch
	 */
	const mockLoadOptions = useCallback(async (query: string) => {
		const res = await fetch(`/options?filter=${query}`);
		if (!res.ok) {
			throw res;
		}
		return res.json();
	}, []);

	return (
		<div>
			<MockDisclaimer />
			<CreateForm<MockedFormData> onSubmit={mockHandleSubmit} onCancel={onCancel}>
				<TextField
					name={'textFieldName'}
					label={'Enter some Text'}
					placeholder={'Type something here...'}
					validators={[mockValidator]}
					autoFocus
					maxLength={255}
				/>
				<AsyncSelect<MockOptions>
					isRequired
					isSearchable
					name={'asyncSelectName'}
					label={'Select an Option'}
					validators={[mockValidator]}
					loadOptions={mockLoadOptions}
				/>
			</CreateForm>
		</div>
	);
}
const exampleCustomPlugin = {
	group: {
		label: 'test',
		icon: 'test-icon',
		key: 'mock-plugin',
	},
	label: 'My Plugin Object',
	icon: 'icon',
	key: ENTITY_KEY,
	form: <ExampleCustomPluginForm />,
};

export default function CreateBasic() {
	return (
		<LinkCreateExitWarningProvider>
			<Example />
		</LinkCreateExitWarningProvider>
	);
}

const Example = () => {
	const withExitWarning = useWithExitWarning();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [link, setLink] = useState<string | null>();
	const [ari, setAri] = useState<string | null>();

	const handleCreate = useCallback(async (payload: CreatePayload) => {
		await new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 2000);
		});
		console.log('handleCreate payload is:', payload);
		setLink(payload.url);
		setAri(payload.ari);

		setDrawerOpen(false);
	}, []);

	const handleComplete = useCallback(() => {
		console.log('Completed');

		setDrawerOpen(false);
	}, []);

	const handleFailure = useCallback(() => {
		console.log('An error');
	}, []);

	const handleCancel = useCallback(() => {
		console.log('Cancelled');

		setDrawerOpen(false);
	}, []);

	const handleDrawerClose = useCallback(() => {
		setDrawerOpen(false);
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
			<Drawer
				label="Default drawer"
				onClose={withExitWarning(handleDrawerClose)}
				isOpen={drawerOpen}
				width="medium"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Box paddingInlineEnd="space.250">
						<InlineCreate
							plugins={[exampleCustomPlugin]}
							testId="inline-create"
							triggeredFrom="example"
							entityKey={ENTITY_KEY}
							onCreate={handleCreate}
							onComplete={handleComplete}
							onFailure={handleFailure}
							onCancel={handleCancel}
						/>
					</Box>
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setDrawerOpen(true)}>
				Open drawer
			</Button>
		</div>
	);
};
