import { shallow } from 'enzyme';
import React from 'react';
import { SingleValueContainer } from '../../../components/SingleValueContainer';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { AvatarOrIcon } from '../../../components/AvatarOrIcon';
import { testUser } from '../_testUtils';
import { type Option } from '../../../types';
import { getAppearanceForAppType } from '@atlaskit/avatar';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar'),
	getAppearanceForAppType: jest.fn(),
}));

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: (props: any) => <div>AvatarOrIcon - {JSON.stringify(props)}</div>,
}));

describe('SingleValueContainer', () => {
	const shallowValueContainer = (props: any) => shallow(<SingleValueContainer {...props} />);

	const userValue: Option = {
		data: testUser,
		label: testUser.name,
		value: '0',
	};

	it('initial, empty: should render default avatar if not focused and no value', () => {
		const component = shallowValueContainer({
			hasValue: false,
			selectProps: { isFocused: false },
		});
		expect(component.find(SizeableAvatar).prop('src')).toBeUndefined();
	});

	it('has value: should not render avatar if not focused and has value', () => {
		const component = shallowValueContainer({
			hasValue: true,
			selectProps: { isFocused: false },
		});
		expect(component.find(SizeableAvatar)).toHaveLength(0);
	});

	it('has query: should render default avatar if focused and no value', () => {
		const component = shallowValueContainer({
			hasValue: false,
			selectProps: { isFocused: false },
		});
		expect(component.find(SizeableAvatar).prop('src')).toBeUndefined();
	});

	it("focus value: should render user's avatar if value matches inputValue", () => {
		const component = shallowValueContainer({
			hasValue: true,
			selectProps: {
				isFocused: true,
				inputValue: testUser.name,
				value: userValue,
			},
		});
		expect(component.find(SizeableAvatar).prop('src')).toEqual(testUser.avatarUrl);
	});

	it('focus value then edit query: should render default avatar if value does not match inputValue', () => {
		const component = shallowValueContainer({
			hasValue: true,
			selectProps: { isFocused: true, inputValue: 'query', value: userValue },
		});
		expect(component.find(SizeableAvatar).prop('src')).toBeUndefined();
	});

	describe('avatarAppearanceShape', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		ffTest.on('jira_ai_agent_avatar_user_picker_user_option', 'on', () => {
			it('should set avatarAppearanceShape', async () => {
				(getAppearanceForAppType as jest.Mock).mockReturnValue('hexagon');

				const userValueWithAppType: Option = {
					data: { ...testUser, appType: 'agent' },
					label: testUser.name,
					value: '0',
				};

				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValueWithAppType,
					},
				});

				expect(getAppearanceForAppType).toHaveBeenCalledWith('agent');
				expect(component.find(SizeableAvatar).prop('avatarAppearanceShape')).toBe('hexagon');
			});
		});

		ffTest.off('jira_ai_agent_avatar_user_picker_user_option', 'off', () => {
			it('should not set avatarAppearanceShape when jira_ai_agent_avatar_user_picker_user_option gate is disabled', async () => {
				const userValueWithAppType: Option = {
					data: { ...testUser, appType: 'agent' },
					label: testUser.name,
					value: '0',
				};

				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValueWithAppType,
					},
				});

				expect(getAppearanceForAppType).not.toHaveBeenCalled();
				expect(component.find(SizeableAvatar).prop('avatarAppearanceShape')).toBeUndefined();
			});
		});
	});

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		ffTest.on('atlaskit_user_picker_support_icon', 'on', () => {
			it('should render AvatarOrIcon when feature gate is enabled and icon is provided', () => {
				const userValueWithIcon: Option = {
					data: { ...testUser, icon: mockIcon },
					label: testUser.name,
					value: '0',
				};

				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValueWithIcon,
					},
				});

				expect(component.find(AvatarOrIcon)).toHaveLength(1);
				expect(component.find(AvatarOrIcon).prop('icon')).toEqual(mockIcon);
			});

			it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', () => {
				const iconColor = '#FF0000';
				const userValueWithIconAndColor: Option = {
					data: { ...testUser, icon: mockIcon, iconColor },
					label: testUser.name,
					value: '0',
				};

				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValueWithIconAndColor,
					},
				});

				expect(component.find(AvatarOrIcon)).toHaveLength(1);
				expect(component.find(AvatarOrIcon).prop('icon')).toEqual(mockIcon);
				expect(component.find(AvatarOrIcon).prop('iconColor')).toEqual(iconColor);
			});

			it('should render SizeableAvatar when feature gate is enabled but no icon is provided', () => {
				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValue,
					},
				});

				expect(component.find(SizeableAvatar)).toHaveLength(1);
			});
		});

		ffTest.off('atlaskit_user_picker_support_icon', 'off', () => {
			it('should render SizeableAvatar when feature gate is disabled even if icon is provided', () => {
				const userValueWithIcon: Option = {
					data: { ...testUser, icon: mockIcon },
					label: testUser.name,
					value: '0',
				};

				const component = shallowValueContainer({
					hasValue: true,
					selectProps: {
						isFocused: true,
						inputValue: testUser.name,
						value: userValueWithIcon,
					},
				});

				expect(component.find(SizeableAvatar)).toHaveLength(1);
				expect(component.find(SizeableAvatar).prop('src')).toEqual(testUser.avatarUrl);
			});
		});
	});
});
