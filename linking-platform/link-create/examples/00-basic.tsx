import React, { useCallback, useMemo, useState } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { MockDisclaimer } from '../example-helpers/mock-disclaimer';
import LinkCreate, {
	AsyncSelect,
	CreateForm,
	TextField,
	useLinkCreateCallback,
	type Validator,
} from '../src';
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
	const [link, setLink] = useState<string | null>();
	const [ari, setAri] = useState<string | null>();
	const [active, setActive] = useState(false);

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
			<Button testId="link-create-show" appearance="primary" onClick={() => setActive(true)}>
				Create
			</Button>
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
			/>
		</div>
	);
}
