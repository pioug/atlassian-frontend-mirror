import { shallow } from 'enzyme';
import React from 'react';
import { SingleValueContainer } from '../../../components/SingleValueContainer';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { testUser } from '../_testUtils';
import { type Option } from '../../../types';
import { getAppearanceForAppType } from '@atlaskit/avatar';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

jest.mock('@atlaskit/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar'),
	getAppearanceForAppType: jest.fn(),
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
});
