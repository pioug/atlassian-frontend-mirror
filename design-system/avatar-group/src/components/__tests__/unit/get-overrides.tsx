import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { getOverrides } from '../../get-overrides';
import type { AvatarProps } from '../../types';

describe('getOverrides', () => {
	it('should return default render functions for all override slots when no overrides are provided', () => {
		const result = getOverrides();

		expect(result).toEqual(
			expect.objectContaining({
				AvatarGroupItem: expect.objectContaining({ render: expect.any(Function) }),
				Avatar: expect.objectContaining({ render: expect.any(Function) }),
				MoreIndicator: expect.objectContaining({ render: expect.any(Function) }),
			}),
		);
	});

	it('should return default render functions for all slots when overrides is an empty object', () => {
		const result = getOverrides({});

		expect(typeof result.AvatarGroupItem.render).toBe('function');
		expect(typeof result.Avatar.render).toBe('function');
		expect(typeof result.MoreIndicator.render).toBe('function');
	});

	it('should be accessible', async () => {
		const result = getOverrides();
		const Component = (props: AvatarProps) => (
			<span data-testid="default-avatar">{props.name}</span>
		);

		render(<>{result.Avatar.render(Component, { name: 'Aaron' }, 0)}</>);
		await expect(screen.getByTestId('default-avatar')).toBeAccessible();
	});

	it('default Avatar render should render the provided component with the supplied props', () => {
		const result = getOverrides();
		const Component = (props: AvatarProps) => (
			<span data-testid="default-avatar">{props.name}</span>
		);

		render(<>{result.Avatar.render(Component, { name: 'Aaron' }, 0)}</>);
		expect(screen.getByTestId('default-avatar')).toHaveTextContent('Aaron');
	});

	it('default AvatarGroupItem render should render the provided component with the supplied props', () => {
		const result = getOverrides();
		const Component: any = (props: { avatar: AvatarProps }) => (
			<span data-testid="default-item">{props.avatar.name}</span>
		);

		render(
			<>{result.AvatarGroupItem.render(Component, { avatar: { name: 'Bobby' }, index: 0 }, 0)}</>,
		);

		expect(screen.getByTestId('default-item')).toHaveTextContent('Bobby');
	});

	it('default MoreIndicator render should render the provided component with the supplied props', () => {
		const result = getOverrides();
		const Component: any = (props: { testId?: string }) => (
			<span data-testid={props.testId}>more</span>
		);

		render(<>{result.MoreIndicator.render(Component, { testId: 'more-id' } as any)}</>);

		expect(screen.getByTestId('more-id')).toHaveTextContent('more');
	});

	it('should use a user-provided Avatar.render override when supplied', () => {
		const customRender = jest.fn(() => <span data-testid="custom-avatar">Overridden</span>);

		const result = getOverrides({ Avatar: { render: customRender } });
		const Component = (props: AvatarProps) => <span>{props.name}</span>;

		render(<>{result.Avatar.render(Component, { name: 'Carla' }, 2)}</>);

		expect(customRender).toHaveBeenCalledWith(Component, { name: 'Carla' }, 2);
		expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
	});

	it('should use a user-provided AvatarGroupItem.render override when supplied', () => {
		const customRender = jest.fn(() => <span data-testid="custom-item">Overridden item</span>);

		const result = getOverrides({ AvatarGroupItem: { render: customRender } });
		const Component: any = () => null;
		const props = { avatar: { name: 'Diana' }, index: 3 } as any;

		render(<>{result.AvatarGroupItem.render(Component, props, 3)}</>);

		expect(customRender).toHaveBeenCalledWith(Component, props, 3);
		expect(screen.getByTestId('custom-item')).toBeInTheDocument();
	});

	it('should use a user-provided MoreIndicator.render override when supplied', () => {
		const customRender = jest.fn(() => <span data-testid="custom-more">Overridden more</span>);

		const result = getOverrides({ MoreIndicator: { render: customRender } });
		const Component: any = () => null;
		const props = { testId: 'mi' } as any;

		render(<>{result.MoreIndicator.render(Component, props)}</>);

		expect(customRender).toHaveBeenCalledWith(Component, props);
		expect(screen.getByTestId('custom-more')).toBeInTheDocument();
	});

	it('should leave unspecified slots using default renders when only one slot is overridden', () => {
		const customAvatar = jest.fn(() => <span />);

		const result = getOverrides({ Avatar: { render: customAvatar } });

		// Only Avatar is custom
		expect(result.Avatar.render).toBe(customAvatar);
		// The other two should still be functions but NOT the same reference
		expect(typeof result.AvatarGroupItem.render).toBe('function');
		expect(result.AvatarGroupItem.render).not.toBe(customAvatar);
		expect(typeof result.MoreIndicator.render).toBe('function');
		expect(result.MoreIndicator.render).not.toBe(customAvatar);
	});

	it('default AvatarGroupItem render should compose a key from the avatar prop', () => {
		const result = getOverrides();
		const Component: any = (props: any) => (
			<span data-testid="keyed">{String(props.avatar.key ?? '')}</span>
		);

		// Render to ensure no exceptions are thrown when generating the key
		render(
			<>
				{result.AvatarGroupItem.render(
					Component,
					{ avatar: { name: 'Eli', key: 'eli@example.com' }, index: 1 } as any,
					1,
				)}
			</>,
		);
		expect(screen.getByTestId('keyed')).toHaveTextContent('eli@example.com');
	});
});
