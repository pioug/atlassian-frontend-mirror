import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { HydratedAssets } from '../../../../ui/jql-editor/types';

import { AssetsNode } from './assets-node';

const AVATAR_URL = 'https://assets-media.example.com/assets/icons/icons48/3D%20Printer.png';
const OBJECT_ARI = 'ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10';

let mockHydratedAssets: HydratedAssets | undefined;
const mockHydrateArgs: { fieldName: string; id: string }[] = [];

jest.mock('../../../../state', () => ({
	...jest.requireActual('../../../../state'),
	useHydratedAssets: (args: { fieldName: string; id: string }) => {
		mockHydrateArgs.push(args);
		return [mockHydratedAssets, undefined];
	},
}));

describe('AssetsNode', () => {
	const renderAssetsNode = ({
		name = 'Object 1',
		error = false,
		selected = false,
	}: {
		error?: boolean;
		name?: string;
		selected?: boolean;
	}) =>
		render(
			<IntlProvider locale="en">
				<AssetsNode
					id={OBJECT_ARI}
					fieldName="Assets"
					name={name}
					error={error}
					selected={selected}
				/>
			</IntlProvider>,
		);

	beforeEach(() => {
		mockHydrateArgs.length = 0;
		mockHydratedAssets = {
			id: OBJECT_ARI,
			name: 'Object 1',
			avatarUrl: AVATAR_URL,
			type: 'assets',
		};
	});

	it('is accessible', async () => {
		const { getByText } = renderAssetsNode({});
		await expect(getByText('Object 1')).toBeAccessible();
	});

	it('displays the object name', () => {
		const { getByText } = renderAssetsNode({ name: 'MacBook Pro 16' });
		expect(getByText('MacBook Pro 16')).toBeVisible();
	});

	it('looks the hydrated value up by the node id and field name', () => {
		renderAssetsNode({});
		expect(mockHydrateArgs[0]).toEqual({ id: OBJECT_ARI, fieldName: 'Assets' });
	});

	it('displays the object icon when the hydrated value has one', () => {
		const { container } = renderAssetsNode({});
		expect(container.querySelector('img')).toHaveAttribute('src', AVATAR_URL);
	});

	it('falls back to a placeholder avatar when the hydrated value has no icon', () => {
		mockHydratedAssets = { id: OBJECT_ARI, name: 'Object 1', type: 'assets' };

		const { container, getByTestId, getByText } = renderAssetsNode({});
		expect(getByTestId('jql-editor-assets-node-avatar')).toBeVisible();
		expect(container.querySelector('img')).not.toBeInTheDocument();
		expect(getByText('Object 1')).toBeVisible();
	});

	it('reserves the icon space before hydration resolves, as for an autocomplete selection', () => {
		mockHydratedAssets = undefined;

		const { getByTestId, getByText } = renderAssetsNode({});
		expect(getByTestId('jql-editor-assets-node-avatar')).toBeVisible();
		expect(getByText('Object 1')).toBeVisible();
	});
});
