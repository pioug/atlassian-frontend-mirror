import React from 'react';

import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';

import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';

import { SingleValueContainer } from '../../../components/SingleValueContainer';
import { type Option } from '../../../types';
import { testUser } from '../_testUtils';

jest.mock('@atlaskit/avatar/get-appearance', () => ({
	...jest.requireActual('@atlaskit/avatar/get-appearance'),
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: ({
		appearance,
		avatarAppearanceShape,
		src,
		type,
	}: {
		appearance: string;
		avatarAppearanceShape?: string;
		src?: string;
		type?: string;
	}) => (
		<div
			data-testid="sizeable-avatar"
			data-appearance={appearance}
			data-avatar-appearance-shape={avatarAppearanceShape}
			data-src={src}
			data-type={type}
		/>
	),
}));

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: ({
		avatarAppearanceShape,
		icon,
		iconColor,
		src,
		type,
	}: {
		avatarAppearanceShape?: string;
		icon: React.ReactNode;
		iconColor?: string;
		src?: string;
		type?: string;
	}) => (
		<div
			data-testid="avatar-or-icon"
			data-avatar-appearance-shape={avatarAppearanceShape}
			data-src={src}
			data-type={type}
			style={{ color: iconColor }}
		>
			{icon}
		</div>
	),
}));

describe('SingleValueContainer', () => {
	const userValue: Option = {
		data: testUser,
		label: testUser.name,
		value: '0',
	};

	const selectComponentProps = {
		getStyles: noop,
		cx: noop,
		getClassNames: noop,
		innerProps: {},
		isDisabled: false,
		isFocused: false,
		isMulti: false,
	};

	const renderValueContainer = (props: Record<string, unknown> = {}) =>
		render(
			<SingleValueContainer
				{...(selectComponentProps as any)}
				children={<span>Current value</span>}
				hasValue={false}
				selectProps={{ isFocused: false }}
				{...(props as any)}
			/>,
		);

	it('renders the default avatar when empty and not focused', async () => {
		renderValueContainer();

		expect(screen.getByTestId('sizeable-avatar')).not.toHaveAttribute('data-src');
		await expect(document.body).toBeAccessible();
	});

	it('does not render an avatar when a value exists and the select is not focused', () => {
		renderValueContainer({ hasValue: true });

		expect(screen.queryByTestId('sizeable-avatar')).not.toBeInTheDocument();
	});

	it('renders the default avatar while an empty focused select is being queried', () => {
		renderValueContainer({
			hasValue: false,
			selectProps: { isFocused: true, inputValue: 'query' },
		});

		expect(screen.getByTestId('sizeable-avatar')).not.toHaveAttribute('data-src');
	});

	it("renders the user's avatar when the focused value matches the input", () => {
		renderValueContainer({
			hasValue: true,
			selectProps: {
				isFocused: true,
				inputValue: testUser.name,
				value: userValue,
			},
		});

		expect(screen.getByTestId('sizeable-avatar')).toHaveAttribute('data-src', testUser.avatarUrl);
	});

	it('renders the default avatar after the focused value is edited', () => {
		renderValueContainer({
			hasValue: true,
			selectProps: { isFocused: true, inputValue: 'query', value: userValue },
		});

		expect(screen.getByTestId('sizeable-avatar')).not.toHaveAttribute('data-src');
	});

	describe('avatar appearance shape', () => {
		it('passes the app avatar shape to the avatar', () => {
			(getAppearanceForAppType as jest.Mock).mockReturnValue('hexagon');

			const userValueWithAppType: Option = {
				data: { ...testUser, appType: 'agent' },
				label: testUser.name,
				value: '0',
			};
			renderValueContainer({
				hasValue: true,
				selectProps: {
					isFocused: true,
					inputValue: testUser.name,
					value: userValueWithAppType,
				},
			});

			expect(getAppearanceForAppType).toHaveBeenCalledWith('agent');
			expect(screen.getByTestId('sizeable-avatar')).toHaveAttribute(
				'data-avatar-appearance-shape',
				'hexagon',
			);
		});
	});

	describe('icon support', () => {
		const mockIcon = <span data-testid="test-icon">Icon</span>;

		it('renders AvatarOrIcon when an icon is provided', () => {
			renderValueContainer({
				hasValue: true,
				selectProps: {
					isFocused: true,
					inputValue: testUser.name,
					value: { data: { ...testUser, icon: mockIcon }, label: testUser.name, value: '0' },
				},
			});

			expect(screen.getByTestId('avatar-or-icon')).toBeInTheDocument();
			expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		});

		it('passes iconColor to AvatarOrIcon', () => {
			renderValueContainer({
				hasValue: true,
				selectProps: {
					isFocused: true,
					inputValue: testUser.name,
					value: {
						data: { ...testUser, icon: mockIcon, iconColor: '#FF0000' },
						label: testUser.name,
						value: '0',
					},
				},
			});

			expect(screen.getByTestId('avatar-or-icon')).toHaveStyle({ color: '#FF0000' });
		});

		it('renders SizeableAvatar when no icon is provided', () => {
			renderValueContainer({
				hasValue: true,
				selectProps: { isFocused: true, inputValue: testUser.name, value: userValue },
			});

			expect(screen.getByTestId('sizeable-avatar')).toBeInTheDocument();
		});
	});
});
