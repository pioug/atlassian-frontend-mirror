import React from 'react';

import { render } from '@testing-library/react';

import Avatar from '@atlaskit/avatar/avatar';

import ObjectResult from '../../ObjectResult';

const DUMMY_AVATAR = <Avatar key="test-avatar" />;

describe('Object Result', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<ObjectResult resultId="testId" name="test" />);
		await expect(container).toBeAccessible();
	});

	it('should render an avatar if `avatarUrl` is provided', () => {
		expect(
			render(<ObjectResult resultId="testId" name="test" avatarUrl="not null" />).getByTestId(
				'object-result',
			),
		).toBeInTheDocument();
	});

	it('should render an avatar if `avatarUrl` is not provided', () => {
		expect(
			render(<ObjectResult resultId="testId" name="test" />).getByTestId('object-result'),
		).toBeInTheDocument();
	});

	it('should render an avatar if `avatar` is provided as a component', () => {
		expect(
			render(
				<ObjectResult resultId="testId" name="test" avatar={DUMMY_AVATAR} />,
			).container.querySelectorAll('svg').length,
		).toBeGreaterThan(0);
	});

	it('should render avatar component if both avatar props are set', () => {
		expect(
			render(
				<ObjectResult resultId="testId" name="test" avatar={DUMMY_AVATAR} avatarUrl="not null" />,
			).container.querySelectorAll('svg').length,
		).toBeGreaterThan(0);
	});

	it('should render `name` prop', () => {
		const name = "Phillip Jacobs' Personal Space";
		expect(
			render(<ObjectResult resultId="testId" name={name} />).getByText(name),
		).toBeInTheDocument();
	});

	it('should render lock icon on private room results', () => {
		expect(
			render(<ObjectResult resultId="testId" name="test" isPrivate />).container.querySelectorAll(
				'svg',
			).length,
		).toBeGreaterThan(1);
	});

	it('should pass null `status` prop to Avatar on non-private room results', () => {
		// No privacy prop supplied
		expect(
			render(<ObjectResult resultId="testId" name="test" />).container.querySelectorAll('svg')
				.length,
		).toBe(1);
	});

	it('should render the `containerName` prop if no objectKey provided', () => {
		const { container } = render(
			<ObjectResult resultId="testId" name="test" containerName="Burger Sling" />,
		);
		expect(container).toHaveTextContent('Burger Sling');
		expect(container).not.toHaveTextContent('· Burger Sling');
	});

	it('should render the `objectKey` and `containerName` prop together', () => {
		expect(
			render(
				<ObjectResult
					resultId="testId"
					name="test"
					objectKey="KFC-11"
					containerName="Burger Sling"
				/>,
			).container,
		).toHaveTextContent('KFC-11 · Burger Sling');
	});
});
