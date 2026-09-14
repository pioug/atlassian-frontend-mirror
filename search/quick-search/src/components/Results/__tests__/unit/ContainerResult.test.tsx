import React from 'react';
import { render } from '@testing-library/react';
import Avatar from '@atlaskit/avatar/avatar';
import ContainerResult from '../../ContainerResult';

const DUMMY_AVATAR = <Avatar key="test-avatar" />;

describe('Container Result', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<ContainerResult resultId="testId" name="test" />);
		await expect(container).toBeAccessible();
	});

	it('should render an avatar if `avatarUrl` is provided', () => {
		const { container } = render(
			<ContainerResult resultId="testId" name="test" avatarUrl="not null" />,
		);
		expect(container.querySelectorAll('img, svg').length).toBeGreaterThan(0);
	});

	it('should render an avatar if `avatarUrl` is not provided', () => {
		const { container } = render(<ContainerResult resultId="testId" name="test" />);
		expect(container.querySelectorAll('img, svg').length).toBeGreaterThan(0);
	});

	it('should render an avatar if `avatar` is provided as a component', () => {
		const { container } = render(
			<ContainerResult resultId="testId" name="test" avatar={DUMMY_AVATAR} />,
		);
		expect(container.querySelectorAll('img, svg').length).toBeGreaterThan(0);
	});

	it('should render avatar component if both avatar props are set', () => {
		const { container } = render(
			<ContainerResult resultId="testId" name="test" avatar={DUMMY_AVATAR} avatarUrl="not null" />,
		);
		expect(container.querySelectorAll('img, svg').length).toBeGreaterThan(0);
	});

	it('should render `name` prop', () => {
		const name = "Phillip Jacobs' Personal Space";
		expect(
			render(<ContainerResult resultId="testId" name={name} />).getByText(name),
		).toBeInTheDocument();
	});

	it('should render lock icon on private room results', () => {
		const { container } = render(<ContainerResult resultId="testId" name="test" isPrivate />);
		expect(container.querySelectorAll('svg').length).toBeGreaterThan(1);
	});

	it('should pass null status prop to Avatar on non-private room results', () => {
		// No privacy prop supplied
		const { container } = render(<ContainerResult resultId="testId" name="test" />);
		expect(container.querySelectorAll('svg').length).toBe(1);
	});
});
