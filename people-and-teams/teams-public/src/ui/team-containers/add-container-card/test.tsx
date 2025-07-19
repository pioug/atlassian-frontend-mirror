import React from 'react';

import { render, screen } from '@testing-library/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives';

import type { ContainerTypes } from '../../../common/types';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

import { AddContainerCard } from './index';

jest.mock('../../../common/utils/get-container-properties', () => ({
	getContainerProperties: jest.fn(),
}));

describe('AddContainerCard', () => {
	const mockContainerProperties = {
		description: 'Test Description',
		icon: <Text testId="test-icon">Icon</Text>,
		title: 'Test Title',
	};

	const containerTypes = ['ConfluenceSpace', 'JiraProject', 'WebLink'];

	beforeEach(() => {
		(getContainerProperties as jest.Mock).mockReturnValue(mockContainerProperties);
	});

	it('should render the title', () => {
		render(<AddContainerCard containerType={'ConfluenceSpace'} onAddAContainerClick={() => {}} />);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render the icon', () => {
		render(<AddContainerCard containerType={'ConfluenceSpace'} onAddAContainerClick={() => {}} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	containerTypes.forEach((containerType) => {
		it(`should render the AddIcon for ${containerType}`, () => {
			render(
				<AddContainerCard
					containerType={containerType as ContainerTypes}
					onAddAContainerClick={() => {}}
				/>,
			);
			expect(screen.getByTestId('add-icon')).toBeInTheDocument();
		});

		it(`should render the description for the ${containerType}`, () => {
			render(
				<AddContainerCard
					containerType={containerType as ContainerTypes}
					onAddAContainerClick={() => {}}
				/>,
			);
			expect(screen.getByText('Test Description')).toBeInTheDocument();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AddContainerCard containerType={'ConfluenceSpace'} onAddAContainerClick={() => {}} />,
		);
		await expect(container).toBeAccessible();
	});

	it('should call onAddAContainerClick when the AddIcon is clicked', () => {
		const onAddAContainerClick = jest.fn();
		render(
			<AddContainerCard
				containerType={'ConfluenceSpace'}
				onAddAContainerClick={onAddAContainerClick}
			/>,
		);
		screen.getByTestId('add-icon').click();
		expect(onAddAContainerClick).toHaveBeenCalledTimes(1);
	});

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<AddContainerCard containerType={'ConfluenceSpace'} onAddAContainerClick={() => {}} />,
		);
		await expect(container).toBeAccessible();
	});
});
