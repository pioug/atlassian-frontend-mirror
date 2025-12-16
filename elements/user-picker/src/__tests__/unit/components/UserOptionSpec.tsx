import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { shallow } from 'enzyme';
import React, { type ReactElement } from 'react';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { type LozengeProps } from '../../../types';
import { AvatarItemOption, textWrapper } from '../../../components/AvatarItemOption';
import { HighlightText } from '../../../components/HighlightText';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { AvatarOrIcon } from '../../../components/AvatarOrIcon';
import { UserOption, type UserOptionProps } from '../../../components/UserOption';

jest.mock('../../../components/AvatarItemOption', () => ({
	...(jest.requireActual('../../../components/AvatarItemOption') as any),
	textWrapper: jest.fn(),
}));

describe('User Option', () => {
	const mockTextWrapper = textWrapper as jest.Mock;

	afterEach(() => {
		jest.resetAllMocks();
	});

	const user = {
		id: 'abc-123',
		name: 'Jace Beleren',
		publicName: 'jbeleren',
		avatarUrl: 'http://avatars.atlassian.com/jace.png',
		byline: 'Teammate',
		lozenge: 'WORKSPACE',
	};

	const shallowOption = (props: Partial<UserOptionProps> = {}) =>
		shallow<UserOption>(<UserOption user={user} status="approved" isSelected={false} {...props} />);

	it('should render UserOption component', () => {
		const component = shallowOption();
		const avatarItemOption = component.find(AvatarItemOption);

		expect(avatarItemOption.props().avatar).toEqual(
			<SizeableAvatar
				appearance="big"
				src="http://avatars.atlassian.com/jace.png"
				presence="approved"
			/>,
		);

		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(<HighlightText>Jace Beleren</HighlightText>);
		expect(primaryText[1].key).toEqual('publicName');
		expect(primaryText[1].props.children[1].props.children[1]).toEqual(
			<HighlightText>jbeleren</HighlightText>,
		);

		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual('Teammate');
		expect(avatarItemOption.props().lozenge).toEqual({
			text: 'WORKSPACE',
		});
	});

	it('should render Option in selected state', () => {
		const component = shallowOption({ isSelected: true });
		const avatarItemOption = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenNthCalledWith(3, token('color.text.selected', colors.B400));

		expect(avatarItemOption.props().avatar).toEqual(
			<SizeableAvatar
				appearance="big"
				src="http://avatars.atlassian.com/jace.png"
				presence="approved"
			/>,
		);

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(<HighlightText>Jace Beleren</HighlightText>);
		expect(primaryText[1].key).toEqual('publicName');
		expect(primaryText[1].props.children[1].props.children[1]).toEqual(
			<HighlightText>jbeleren</HighlightText>,
		);

		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual('Teammate');
		expect(avatarItemOption.props().lozenge).toEqual({
			text: 'WORKSPACE',
		});
	});

	it('should render lozenge when providing LozengeProps type object', () => {
		const lozengeObject: LozengeProps = {
			text: 'GUEST',
			appearance: 'new',
		};

		const userWithLozenge = {
			...user,
			lozenge: lozengeObject,
		};

		const component = shallowOption({ user: userWithLozenge });

		const avatarItemOption = component.find(AvatarItemOption);

		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));
		expect(mockTextWrapper).toHaveBeenNthCalledWith(2, token('color.text.subtlest', colors.N200));
		expect(avatarItemOption.props().avatar).toEqual(
			<SizeableAvatar
				appearance="big"
				src="http://avatars.atlassian.com/jace.png"
				presence="approved"
			/>,
		);

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(<HighlightText>Jace Beleren</HighlightText>);
		expect(primaryText[1].key).toEqual('publicName');
		expect(primaryText[1].props.children[1].props.children[1]).toEqual(
			<HighlightText>jbeleren</HighlightText>,
		);

		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual('Teammate');
		expect(avatarItemOption.props().lozenge).toEqual({
			text: 'GUEST',
			appearance: 'new',
		});
	});

	it('should highlight text', () => {
		const userWithHighlight = {
			...user,
			highlight: {
				name: [{ start: 0, end: 2 }],
				publicName: [{ start: 2, end: 4 }],
			},
		};
		const component = shallowOption({ user: userWithHighlight });
		const avatarItemOption = component.find(AvatarItemOption);

		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));
		expect(mockTextWrapper).toHaveBeenNthCalledWith(2, token('color.text.subtlest', colors.N200));
		expect(avatarItemOption.props().avatar).toEqual(
			<SizeableAvatar
				appearance="big"
				src="http://avatars.atlassian.com/jace.png"
				presence="approved"
			/>,
		);

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(
			<HighlightText highlights={[{ start: 0, end: 2 }]}>Jace Beleren</HighlightText>,
		);
		expect(primaryText[1].key).toEqual('publicName');
		expect(primaryText[1].props.children[1].props.children[1]).toEqual(
			<HighlightText highlights={[{ start: 2, end: 4 }]}>jbeleren</HighlightText>,
		);

		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual('Teammate');
	});

	it('should show only the name when no publicName is provided', () => {
		const userWithoutName = {
			id: 'abc-123',
			name: 'jbeleren',
			highlight: {
				name: [{ start: 2, end: 4 }],
				publicName: [],
			},
		};
		const component = shallowOption({ user: userWithoutName });
		const avatarItemOption = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].props.children).toEqual(
			<HighlightText highlights={[{ start: 2, end: 4 }]}>jbeleren</HighlightText>,
		);
	});

	it('should show only name', () => {
		const userWithSamePublicName = {
			...user,
			publicName: user.name,
		};
		const component = shallowOption({ user: userWithSamePublicName });
		const avatarItemOption = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(<HighlightText>Jace Beleren</HighlightText>);
	});

	it('should ignore blank spaces while comparing', () => {
		const userWithSamePublicName = {
			...user,
			publicName: `  ${user.name}  `,
		};
		const component = shallowOption({ user: userWithSamePublicName });
		const avatarItemOption = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', colors.N800));

		const primaryText = avatarItemOption.props().primaryText as ReactElement[];

		expect(primaryText[0].key).toEqual('name');
		expect(primaryText[0].props.children).toEqual(<HighlightText>Jace Beleren</HighlightText>);
	});

	ffTest.on('jira_ai_agent_avatar_user_picker_user_option', 'on', () => {
		it('should render hexagon avatar when appType is agent with feature flag enabled', () => {
			const getAppearanceForAppTypeSpy = jest.spyOn(
				require('@atlaskit/avatar'),
				'getAppearanceForAppType',
			);
			const userWithAgentAppType = {
				...user,
				appType: 'agent',
			};

			const component = shallowOption({ user: userWithAgentAppType });
			const avatarItemOption = component.find(AvatarItemOption);

			expect(getAppearanceForAppTypeSpy).toHaveBeenCalledWith('agent');
			expect(getAppearanceForAppTypeSpy).toHaveReturnedWith('hexagon');

			const avatar = avatarItemOption.props().avatar as ReactElement;
			expect(avatar.props.avatarAppearanceShape).toBe('hexagon');

			getAppearanceForAppTypeSpy.mockRestore();
		});
	});

	ffTest.off('jira_ai_agent_avatar_user_picker_user_option', 'off', () => {
		it('should not render hexagon avatar when appType is agent with feature flag disabled', () => {
			const getAppearanceForAppTypeSpy = jest.spyOn(
				require('@atlaskit/avatar'),
				'getAppearanceForAppType',
			);
			const userWithAgentAppType = {
				...user,
				appType: 'agent',
			};

			const component = shallowOption({ user: userWithAgentAppType });
			const avatarItemOption = component.find(AvatarItemOption);

			expect(getAppearanceForAppTypeSpy).not.toHaveBeenCalled();

			const avatar = avatarItemOption.props().avatar as ReactElement;
			expect(avatar.props.avatarAppearanceShape).toBeUndefined();

			getAppearanceForAppTypeSpy.mockRestore();
		});
	});

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		ffTest.on('atlaskit_user_picker_support_icon', 'on', () => {
			it('should render AvatarOrIcon when feature gate is enabled and icon is provided', () => {
				const userWithIcon = {
					...user,
					icon: mockIcon,
				};

				const component = shallowOption({ user: userWithIcon });
				const avatarItemOption = component.find(AvatarItemOption);
				const avatar = avatarItemOption.props().avatar as ReactElement;

				expect(avatar.type).toBe(AvatarOrIcon);
				expect(avatar.props.icon).toEqual(mockIcon);
				expect(avatar.props.src).toEqual(user.avatarUrl);
			});

			it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', () => {
				const iconColor = '#FF0000';
				const userWithIconAndColor = {
					...user,
					icon: mockIcon,
					iconColor,
				};

				const component = shallowOption({ user: userWithIconAndColor });
				const avatarItemOption = component.find(AvatarItemOption);
				const avatar = avatarItemOption.props().avatar as ReactElement;

				expect(avatar.type).toBe(AvatarOrIcon);
				expect(avatar.props.icon).toEqual(mockIcon);
				expect(avatar.props.iconColor).toEqual(iconColor);
			});
		});

		it('should render SizeableAvatar when feature gate is enabled but no icon is provided', () => {
			const component = shallowOption();
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(SizeableAvatar);
		});

		ffTest.off('atlaskit_user_picker_support_icon', 'off', () => {
			it('should render SizeableAvatar when feature gate is disabled even if icon is provided', () => {
				const userWithIcon = {
					...user,
					icon: mockIcon,
				};

				const component = shallowOption({ user: userWithIcon });
				const avatarItemOption = component.find(AvatarItemOption);
				const avatar = avatarItemOption.props().avatar as ReactElement;

				expect(avatar.type).toBe(SizeableAvatar);
				expect(avatar.props.src).toEqual(user.avatarUrl);
			});
		});
	});
});
