import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { Icon } from '../Icon';

jest.mock('react-render-image');

describe('Icon', () => {
	it('renders icon', () => {
		renderWithIntl(<Icon icon={<span data-testid="block-card-icon-icon" />} />);

		const icon = screen.getByTestId('block-card-icon-icon');

		expect(icon).toBeDefined();
	});

	it('renders icon from url', () => {
		renderWithIntl(<Icon url="src-loaded" testId="custom-block-card" />);

		const urlIcon = screen.getByTestId('custom-block-card-image');

		expect(urlIcon).toBeDefined();
	});

	it('renders default icon if neither icon nor url provided', () => {
		renderWithIntl(<Icon />);

		const defaultIcon = screen.getByTestId('block-card-icon-default');

		expect(defaultIcon).toBeDefined();
	});

	it('renders default icon on broken url', () => {
		renderWithIntl(<Icon url="src-error" testId="block-card-icon" />);

		const defaultIcon = screen.getByTestId('block-card-icon-default');

		expect(defaultIcon).toBeDefined();
	});

	it('renders provided default icon on broken url', () => {
		renderWithIntl(
			<Icon url="src-error" defaultIcon={<span data-testid="block-card-icon-custom-default" />} />,
		);

		const customDefaultIcon = screen.getByTestId('block-card-icon-custom-default');

		expect(customDefaultIcon).toBeDefined();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<Icon icon={<span data-testid="block-card-icon-icon" />} />,
		);
		await expect(container).toBeAccessible();
	});
});
