import React from 'react';

import { render, screen } from '@testing-library/react';

import { Text } from '@atlaskit/primitives';

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

	beforeEach(() => {
		(getContainerProperties as jest.Mock).mockReturnValue(mockContainerProperties);
	});

	it('should render the title', () => {
		render(<AddContainerCard containerType={'confluence'} />);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render the description', () => {
		render(<AddContainerCard containerType={'confluence'} />);
		expect(screen.getByText('Test Description')).toBeInTheDocument();
	});

	it('should render the icon', () => {
		render(<AddContainerCard containerType={'confluence'} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('should render the AddIcon', () => {
		render(<AddContainerCard containerType={'confluence'} />);
		expect(screen.getByTestId('add-icon')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<AddContainerCard containerType={'confluence'} />);
		await expect(container).toBeAccessible();
	});
});
