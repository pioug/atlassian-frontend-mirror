import { shallow } from 'enzyme';
import React, { type ReactElement } from 'react';
import { AvatarItemOption, textWrapper } from '../../../components/AvatarItemOption';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { AvatarOrIcon } from '../../../components/AvatarOrIcon';
import { CustomOption, type CustomOptionProps } from '../../../components/CustomOption/main';
import { type Custom } from '../../../types';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

jest.mock('../../../components/AvatarItemOption', () => ({
	...(jest.requireActual('../../../components/AvatarItemOption') as any),
	textWrapper: jest.fn(),
}));

describe('Custom Option', () => {
	const mockTextWrapper = textWrapper as jest.Mock;

	afterEach(() => {
		jest.resetAllMocks();
	});

	const byline = 'A custom byline';
	const basicCustomOption: Custom = {
		id: 'custom-option-1',
		name: 'Custom-Option-1',
		avatarUrl: 'https://avatars.atlassian.com/team-1.png',
		type: 'custom',
		byline,
	};

	const shallowOption = (props: Partial<CustomOptionProps> = {}, data: Custom) =>
		shallow(<CustomOption data={data} isSelected={false} {...props} />);

	it('should render avatarUrl', () => {
		const component = shallowOption({ isSelected: true }, basicCustomOption);
		const avatarOptionProps = component.find(AvatarItemOption);

		expect(avatarOptionProps.props().avatar).toEqual(
			<SizeableAvatar appearance="big" src="https://avatars.atlassian.com/team-1.png" />,
		);
	});

	it('should render the byline', () => {
		const component = shallowOption({ isSelected: true }, basicCustomOption);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(byline);
	});

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		it('should render AvatarOrIcon when icon is provided', () => {
			const customWithIcon = {
				...basicCustomOption,
				icon: mockIcon,
			};

			const component = shallowOption({ isSelected: true }, customWithIcon);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(AvatarOrIcon);
			expect(avatar.props.icon).toEqual(mockIcon);
			expect(avatar.props.src).toEqual(basicCustomOption.avatarUrl);
		});

		it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', () => {
			const iconColor = '#FF0000';
			const customWithIconAndColor = {
				...basicCustomOption,
				icon: mockIcon,
				iconColor,
			};

			const component = shallowOption({ isSelected: true }, customWithIconAndColor);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(AvatarOrIcon);
			expect(avatar.props.icon).toEqual(mockIcon);
			expect(avatar.props.iconColor).toEqual(iconColor);
		});

		it('should render SizeableAvatar when no icon is provided', () => {
			const component = shallowOption({ isSelected: true }, basicCustomOption);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(SizeableAvatar);
		});
	});
});
