import React, { useCallback, useMemo, useState } from 'react';

import Button from '@atlaskit/button/new';
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

const ENTITY_KEY = 'object-name';

function MockPluginForm() {
	const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

	type MockOptions = {
		label: string;
		value: string;
	};

	const mockHandleSubmit = async (data: FormData) => {
		// @ts-ignore .get is undefined at runtime
		if (data['asyncSelect-name']?.value === 'option-3') {
			onFailure && onFailure(Error('Intentional failure'));
			return;
		}

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

	const mockLoadOptions = useCallback(async () => {
		const exampleOptions = [
			{ label: 'Option 1', value: 'option-1' },
			{ label: 'Option 2', value: 'option-2' },
			{ label: 'Option 3 (which will fail)', value: 'option-3' },
		];

		try {
			return exampleOptions;
		} catch (error) {
			if (error instanceof Error) {
				onFailure && onFailure(error);
			}
			return [];
		}
	}, [onFailure]);

	return (
		<div>
			<MockDisclaimer />
			<CreateForm<FormData> onSubmit={mockHandleSubmit} onCancel={onCancel}>
				<TextField
					name={'textField-name'}
					label={'Enter some Text'}
					placeholder={'Type something here...'}
					validators={[mockValidator]}
					autoFocus
					maxLength={255}
				/>
				<AsyncSelect<MockOptions>
					isRequired
					isSearchable
					name={'asyncSelect-name'}
					label={'Select an Option'}
					validators={[mockValidator]}
					defaultOptions={true}
					loadOptions={mockLoadOptions}
				></AsyncSelect>
			</CreateForm>
		</div>
	);
}

export default function CreateBasic() {
	const [link, setLink] = useState<string | null>();
	const [active, setActive] = useState(false);

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

	const plugins = [mockPlugin()];

	const handleCreate = useCallback(async (payload: CreatePayload) => {
		await new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 2000);
		});
		setLink(payload.url);
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
			{link && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ marginBottom: token('space.200', '1rem') }}>
					<a href={link} target="_blank" rel="noopener noreferrer nofollow">
						{link}
					</a>
				</div>
			)}

			<Button testId="link-create-show" appearance="primary" onClick={() => setActive(true)}>
				Create
			</Button>
			<LinkCreate
				active={active}
				plugins={plugins}
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
