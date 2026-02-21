import { AnalyticsListener } from '@atlaskit/analytics-next';
import Select from '@atlaskit/select';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import selectEvent from 'react-select-event';
import { type ConcurrentExperience, type UFOExperience, ufologger } from '@atlaskit/ufo';
import { mount, shallow, type ReactWrapper } from 'enzyme';
import debounce from 'lodash/debounce';
import React from 'react';

import {
	BaseUserPicker,
	BaseUserPickerWithoutAnalytics,
	type BaseUserPickerProps,
} from '../../../components/BaseUserPicker';
import { getComponents } from '../../../components/components';
import { startSession } from '../../../analytics';
import { optionToSelectableOption, optionToSelectableOptions } from '../../../components/utils';
import {
	EmailType,
	type Custom,
	type Option,
	type OptionData,
	type Team,
	type User,
	type Group,
	type UserPickerProps,
	UserType,
	type Value,
	type ExternalUser,
	type LoadOptions,
} from '../../../types';
import { MockConcurrentExperienceInstance } from '../_testUtils';
import type { AriaAttributes } from 'react';

// Mock debounce to track calls
jest.mock('lodash/debounce');
const mockDebounce = debounce as jest.MockedFunction<typeof debounce>;

// Set up debounce mock to return a function with cancel and flush methods
mockDebounce.mockImplementation((fn) => {
	const debouncedFn = fn as any;
	debouncedFn.cancel = jest.fn();
	debouncedFn.flush = jest.fn();
	return debouncedFn;
});

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };
jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: ({ defaultMessage, children }: { children?: any; defaultMessage: string }) =>
			children ? children(defaultMessage) : <span>{defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
	};
});

const mockOptionsShown = new MockConcurrentExperienceInstance('user-picker-rendered');
jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(experienceId: string): ConcurrentExperience => ({
			// @ts-expect-error partial getInstance mock
			getInstance: (_: string): Partial<UFOExperience> => {
				if (experienceId === 'user-picker-options-shown') {
					return mockOptionsShown;
				}
				throw new Error(
					`ConcurrentExperience used without id mocked in UserPickerSpec: ${experienceId}`,
				);
			},
		}),
	),
}));

jest.mock('../../../analytics', () => ({
	...jest.requireActual('../../../analytics'),
	startSession: jest.fn(),
}));
const startSessionMock = startSession as jest.MockedFunction<typeof startSession>;
const mockSessionId = (
	id: string,
	jestMockFn: 'mockReturnValue' | 'mockReturnValueOnce' = 'mockReturnValue',
) => {
	startSessionMock[jestMockFn]({
		start: 0,
		inputChangeTime: 0,
		upCount: 0,
		downCount: 0,
		id,
	});
};

const ID_1 = '111111111111111111111111';
const ID_2 = '111111111111111111111110';
const ID_3 = '111111111111111111111112';
const INVALID_ID_1 = 'invalid@id.com';
const INVALID_ID_2 = 'Bob Ross';

const OLD_AAID = '1234567:12345678-1234-1234-1234-123456789012';
const TEAM_ID = '12345678-1234-1234-1234-123456789012';
const GROUP_ID = '12345678-1234-1234-1234-123456789013';
const CUSTOM_ID = '12345678-1234-1234-1234-123456789014';

const getBasePicker =
	(BasePickerComponent: React.JSXElementConstructor<BaseUserPickerProps>) =>
	(props: Partial<BaseUserPickerProps> = {}) => (
		<BasePickerComponent
			inputId="test"
			fieldId="test"
			SelectComponent={Select}
			styles={{}}
			components={getComponents(props.isMulti)}
			width="100%"
			{...props}
		/>
	);

const getBasePickerWithoutAnalytics = getBasePicker(BaseUserPickerWithoutAnalytics);

const getBasePickerWithAnalytics = getBasePicker(BaseUserPicker);

const getBasePickerWithForm = (props: Partial<BaseUserPickerProps> = {}) => (
	<form>
		<label htmlFor="test">Test</label>
		{getBasePicker(BaseUserPickerWithoutAnalytics)(props)}
	</form>
);

describe('BaseUserPicker', () => {
	const shallowUserPicker = (props: Partial<UserPickerProps> = {}) =>
		shallow(getBasePickerWithoutAnalytics(props));

	const options: User[] = [
		{
			id: ID_1,
			name: 'Jace Beleren',
			publicName: 'jbeleren',
			type: 'user',
		},
		{
			id: ID_2,
			name: 'Chandra Nalaar',
			publicName: 'cnalaar',
			type: 'user',
		},
	];

	// original options have new AAID format
	const mixedOptions: OptionData[] = [
		...options,
		{
			id: OLD_AAID,
			name: 'old user',
			publicName: 'old user',
			type: 'user',
		},
		{
			id: GROUP_ID,
			name: 'SmartGroup',
			type: 'group',
		},
		{
			id: TEAM_ID,
			name: 'SmartExperiences',
			type: 'team',
		},
		{
			id: CUSTOM_ID,
			name: 'SlackChannel',
			type: 'custom',
		},
		{
			id: INVALID_ID_1,
			name: 'hi@id.com',
			publicName: 'hi@id.com',
			type: 'user',
		},
		{
			id: INVALID_ID_2,
			name: 'Bob Ross',
			publicName: 'Bob Ross',
			type: 'user',
		},
	];

	const externalOptions: ExternalUser[] = [
		{
			id: ID_2,
			name: 'Chandra Nalaar',
			publicName: 'cnalaar',
			isExternal: true,
			sources: ['google'],
		},
	];

	const customOptions: Custom[] = [
		{
			id: ID_3,
			name: 'Aris Puddle',
			type: 'custom',
			analyticsType: 'experiment',
		},
	];

	const emailValue: OptionData = {
		id: 'email@atlassian.com',
		name: 'email@atlassian.com',
		type: EmailType,
	};

	const userOptions: Option[] = optionToSelectableOptions(options);

	beforeEach(() => {
		mockSessionId('random-session-id');
		mockDebounce.mockClear();
	});

	afterEach(() => {
		startSessionMock.mockReset();
	});

	it('should render using a Select', async () => {
		const component = shallowUserPicker({ options });
		const select = component.find(Select);

		expect(select.prop('options')).toEqual(userOptions);
		expect(select.prop('menuPlacement')).toBeTruthy();
		expect(select.prop('instanceId')).toEqual('test'); // match fieldId

		await expect(document.body).toBeAccessible();
	});

	it('should disable picker if isDisabled is true', async () => {
		const { getByRole } = render(getBasePickerWithoutAnalytics({ isDisabled: true }));

		// enable hidden since input is disabled
		const input = getByRole('combobox', { hidden: true });

		expect(input).toBeDisabled();

		await expect(document.body).toBeAccessible();
	});

	it('should set custom placeholder', async () => {
		const custom = 'custom placeholder';
		const { container } = render(getBasePickerWithoutAnalytics({ placeholder: custom }));

		expect(
			container.querySelectorAll('#react-select-test-placeholder')[0] as HTMLElement,
		).toHaveTextContent(custom);

		await expect(document.body).toBeAccessible();
	});

	it('should set custom empty placeholder', async () => {
		const custom = '';
		const defaultPlaceholder = 'Enter people or teams...';
		const { container } = render(getBasePickerWithoutAnalytics({ placeholder: custom }));

		const input = container.querySelectorAll('#react-select-test-placeholder')[0] as HTMLElement;
		// make sure default message does not exist
		expect(input).not.toHaveTextContent(defaultPlaceholder);
		expect(input).toHaveTextContent(custom);

		// eslint-disable-next-line @atlassian/a11y/no-violation-count
		await expect(document.body).toBeAccessible({ violationCount: 2 });
	});

	describe('noOptionsMessage', () => {
		it('should pass custom no options component to picker', async () => {
			const customMessage = 'No options found';
			const { container } = render(
				getBasePickerWithoutAnalytics({
					noOptionsMessage: () => <div>{customMessage}</div>,
				}),
			);

			await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

			expect(container).toHaveTextContent(customMessage);

			await expect(document.body).toBeAccessible();
		});

		it('should pass custom no options message to picker', async () => {
			const customMessage = 'Custom';
			const { container } = render(
				getBasePickerWithoutAnalytics({
					noOptionsMessage: () => customMessage,
				}),
			);

			await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

			expect(container).toHaveTextContent(customMessage);

			await expect(document.body).toBeAccessible();
		});

		it('should pass custom no options react node to picker', async () => {
			const customMessage = 'No options found';
			const { container } = render(
				getBasePickerWithoutAnalytics({
					noOptionsMessage: <div>{customMessage}</div>,
				}),
			);

			await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

			expect(container).toHaveTextContent(customMessage);

			await expect(document.body).toBeAccessible();
		});
	});

	it('should show loadOptionsErrorMessage on server error', async () => {
		const loadOptionsError = (() =>
			new Promise<OptionData>((_, reject) => reject('Failed'))) as LoadOptions;

		const { container } = render(
			getBasePickerWithoutAnalytics({
				loadOptions: loadOptionsError,
			}),
		);

		await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

		await waitFor(() => {
			expect(container).toHaveTextContent('Something went wrong');
		});

		await expect(document.body).toBeAccessible();
	});

	it('should show custom loadOptionsErrorMessage on server error', async () => {
		const customLoadOptionsErrorMessage = 'Custom error';
		const customNoOptionsMessage = 'Custom no options';
		const loadOptionsError = (() =>
			new Promise<OptionData>((_, reject) => reject('Failed'))) as LoadOptions;

		const { container } = render(
			getBasePickerWithoutAnalytics({
				noOptionsMessage: () => customNoOptionsMessage,
				loadOptionsErrorMessage: () => customLoadOptionsErrorMessage,
				loadOptions: loadOptionsError,
			}),
		);

		await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

		await waitFor(() => {
			expect(container).toHaveTextContent(customLoadOptionsErrorMessage);
		});

		await expect(document.body).toBeAccessible();
	});

	it('should trigger onChange with User', async () => {
		const onChange = jest.fn();
		render(getBasePickerWithForm({ onChange, options }));

		act(() => screen.getByRole('combobox').focus());
		act(() => screen.getByText(options[0].name).click());

		expect(onChange).toHaveBeenCalledWith(options[0], 'select-option');

		await expect(document.body).toBeAccessible();
	});

	it('should trigger props.onSelection if onChange with select-option action', async () => {
		const onSelection = jest.fn();
		render(getBasePickerWithForm({ onSelection, options }));

		act(() => screen.getByRole('combobox').focus());
		act(() => screen.getByText(options[0].name).click());

		expect(onSelection).toHaveBeenCalledWith(
			options[0],
			'random-session-id',
			expect.any(BaseUserPickerWithoutAnalytics),
		);

		await expect(document.body).toBeAccessible();
	});

	it('should trigger props.onClear if onChange with clear action', async () => {
		const onClear = jest.fn();
		render(
			getBasePickerWithForm({
				onClear,
				defaultValue: {
					id: 'id',
					name: 'default user',
					type: 'user',
				},
			}),
		);
		// clear button is available when hover or focus
		await userEvent.hover(screen.getByRole('combobox'));
		await userEvent.click(screen.getByRole('button', { name: /clear/i }));
		expect(onClear).toHaveBeenCalled();

		await expect(document.body).toBeAccessible();
	});

	it('should display no loading message', async () => {
		const { container } = render(getBasePickerWithoutAnalytics({ isLoading: true }));

		await selectEvent.openMenu(container.querySelectorAll('#test')[0] as HTMLElement);

		expect(container).not.toHaveTextContent('No options');

		await expect(document.body).toBeAccessible();
	});

	it('should call onFocus handler', async () => {
		const onFocus = jest.fn();
		const { getByRole } = render(getBasePickerWithoutAnalytics({ onFocus }));

		getByRole('combobox').focus();
		expect(onFocus).toHaveBeenCalledWith('random-session-id');

		await expect(document.body).toBeAccessible();
	});

	it('should call onBlur handler', async () => {
		const onBlur = jest.fn();
		const { getByRole } = render(getBasePickerWithoutAnalytics({ onBlur }));

		const input = getByRole('combobox');
		input.focus();
		input.blur();
		expect(onBlur).toHaveBeenCalledWith('random-session-id');

		await expect(document.body).toBeAccessible();
	});

	it('should call onOpen handler', async () => {
		const onOpen = jest.fn();

		render(getBasePickerWithoutAnalytics({ onOpen }));

		act(() => screen.getByRole('combobox').focus());
		expect(onOpen).toHaveBeenCalledWith('random-session-id');

		await expect(document.body).toBeAccessible();
	});

	it('should call onClose handler', async () => {
		const onClose = jest.fn();

		const { getByRole } = render(getBasePickerWithoutAnalytics({ onClose }));

		const input = getByRole('combobox');
		input.focus();
		input.blur();
		expect(onClose).toHaveBeenCalledWith('random-session-id');

		await expect(document.body).toBeAccessible();
	});

	it('should call onInputChange handler', async () => {
		const onInputChange = jest.fn();

		const { getByRole } = render(getBasePickerWithoutAnalytics({ onInputChange }));

		const input = getByRole('combobox');
		input.focus();
		fireEvent.change(input, { target: { value: 't' } });
		expect(onInputChange).toHaveBeenCalledWith('t', 'random-session-id');

		// eslint-disable-next-line @atlassian/a11y/no-violation-count
		await expect(document.body).toBeAccessible({ violationCount: 2 });
	});

	describe('Multiple users select', () => {
		it('should set isMulti in Select', async () => {
			const component = shallowUserPicker({ options, isMulti: true });
			const select = component.find(Select);
			expect(select.prop('isMulti')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});

		it('should call onChange with an array of users', async () => {
			const onChange = jest.fn();
			const component = shallowUserPicker({ options, isMulti: true, onChange });

			component.find(Select).simulate('change', userOptions, { action: 'select-option' });

			expect(onChange).toHaveBeenCalledWith([options[0], options[1]], 'select-option');

			await expect(document.body).toBeAccessible();
		});

		it('should call onSelection with an array of users', async () => {
			const onSelection = jest.fn();
			const component = shallowUserPicker({
				options,
				isMulti: true,
				open: true,
				onSelection,
			});

			component.find(Select).simulate('change', userOptions, { action: 'select-option' });

			expect(onSelection).toHaveBeenCalledWith(
				[options[0], options[1]],
				'random-session-id',
				expect.any(BaseUserPickerWithoutAnalytics),
			);

			await expect(document.body).toBeAccessible();
		});

		it('should remove user correctly', async () => {
			let value = [] as Value;
			const onChange = jest.fn();
			const component = shallowUserPicker({
				options,
				isMulti: true,
				onChange,
				value,
			});

			component.find(Select).simulate('change', [userOptions[0]], { action: 'select-option' });
			expect(onChange).toBeCalledWith(
				[
					{
						id: ID_1,
						name: 'Jace Beleren',
						publicName: 'jbeleren',
						type: 'user',
					},
				],
				'select-option',
			);

			component.find(Select).simulate('change', null, {
				action: 'remove-value',
				removedValue: optionToSelectableOption(options[0]),
			});
			expect(onChange).toBeCalledWith(undefined, 'remove-value');

			component.find(Select).simulate('change', [userOptions[1]], { action: 'select-option' });

			expect(onChange).toBeCalledWith(
				[
					{
						id: ID_2,
						name: 'Chandra Nalaar',
						publicName: 'cnalaar',
						type: 'user',
					},
				],
				'select-option',
			);

			await expect(document.body).toBeAccessible();
		});

		it('should remove user correctly when no value props provided', async () => {
			const onChange = jest.fn();
			const component = shallowUserPicker({
				options,
				isMulti: true,
				onChange,
			});

			component.find(Select).simulate('change', [userOptions[0]], { action: 'select-option' });
			expect(onChange).toBeCalledWith([options[0]], 'select-option');
			// test deletion based on id
			expect(component.find(Select).props().value).toEqual([
				{ data: options[0], label: 'Jace Beleren', value: ID_1 },
			]);
			const sameIdItem = { ...options[0], label: 'Jace' };

			// when value deselected and no items selected, the value
			// parameter is set to null
			component.find(Select).simulate('change', null, {
				action: 'remove-value',
				removedValue: optionToSelectableOption(sameIdItem),
			});
			expect(onChange).toBeCalledWith(undefined, 'remove-value');

			expect(component.find(Select).props().value).toEqual([]);

			await expect(document.body).toBeAccessible();
		});
	});

	it('should set hovering clear indicator', async () => {
		const component = shallowUserPicker();
		const select = component.find(Select);
		select.simulate('clearIndicatorHover', true);
		expect(component.state()).toHaveProperty('hoveringClearIndicator', true);

		await expect(document.body).toBeAccessible();
	});

	it('should set isClearable to false', async () => {
		const component = shallowUserPicker({ isClearable: false });
		const select = component.find(Select);
		expect(select.prop('isClearable')).toEqual(false);

		await expect(document.body).toBeAccessible();
	});

	it('should open menu onFocus', async () => {
		const component = shallowUserPicker();
		const select = component.find(Select);
		select.simulate('focus');
		expect(component.state()).toHaveProperty('menuIsOpen', true);

		await expect(document.body).toBeAccessible();
	});

	it('should close menu onBlur', async () => {
		const component = shallowUserPicker();
		component.setState({ menuIsOpen: true });
		const select = component.find(Select);
		select.simulate('blur');
		expect(component.state()).toHaveProperty('menuIsOpen', false);

		await expect(document.body).toBeAccessible();
	});

	describe('appearance', () => {
		it('should infer normal appearance if single picker', async () => {
			const component = shallowUserPicker();

			expect(component.find(Select).prop('appearance')).toEqual('normal');

			await expect(document.body).toBeAccessible();
		});

		it('should pass in appearance that comes from props', async () => {
			const component = shallowUserPicker({
				isMulti: true,
				appearance: 'normal',
			});

			expect(component.find(Select).prop('appearance')).toEqual('normal');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('auto focus', () => {
		it('should autoFocus if open by default', async () => {
			const component = shallowUserPicker({ open: true });
			expect(component.find(Select).prop('autoFocus')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});

		it('should not autoFocus if not open by default', async () => {
			const component = shallowUserPicker();
			expect(component.find(Select).prop('autoFocus')).toBeFalsy();

			await expect(document.body).toBeAccessible();
		});

		it('should always autoFocus if prop set to true', async () => {
			const component = shallowUserPicker({ autoFocus: true });
			expect(component.find(Select).prop('autoFocus')).toBeTruthy();

			await expect(document.body).toBeAccessible();
		});

		it('should never autoFocus if prop set to false', async () => {
			const component = shallowUserPicker({ open: true, autoFocus: false });
			expect(component.find(Select).prop('autoFocus')).toBeFalsy();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('async load', () => {
		beforeEach(() => jest.useFakeTimers());
		afterEach(() => jest.useRealTimers());

		it('should load users when picker open', async () => {
			const usersPromise = new Promise<User[]>((resolve) =>
				window.setTimeout(() => resolve(options), 500),
			);
			const loadOptions = jest.fn(() => usersPromise);
			const component = shallowUserPicker({ loadOptions });
			component.setProps({ open: true });
			jest.runAllTimers();
			expect(loadOptions).toHaveBeenCalled();
			return usersPromise.then(() => {
				jest.runAllTimers();
				expect(component.state()).toMatchObject({
					options,
				});
			});

			await expect(document.body).toBeAccessible();
		});

		describe('onInputChange', () => {
			it.each([['input-change'], ['set-value']])(
				'should load users on input change with action "%s"',
				(action) => {
					const usersPromise = new Promise<User[]>((resolve) =>
						window.setTimeout(() => resolve(options), 500),
					);
					const loadOptions = jest.fn(() => usersPromise);
					const component = shallowUserPicker({ loadOptions });
					const select = component.find(Select);
					select.simulate('inputChange', 'some text', { action });
					expect(component.find(Select).prop('isLoading')).toBeTruthy();
					jest.runAllTimers();
					expect(loadOptions).toHaveBeenCalled();
					expect(loadOptions).toHaveBeenCalledWith('some text');
					return usersPromise.then(() => {
						jest.runAllTimers();
						expect(component.state()).toMatchObject({
							options,
						});
					});
				},
			);

			it('should replace old options after new query', async () => {
				const options2 = [
					{
						id: 'some-id',
						name: 'Some Value',
						publicName: 'svalue',
					},
					{
						id: 'some-id-2',
						name: 'Second Value',
						publicName: 'svalue2',
					},
				];
				const promise1 = new Promise<User[]>((resolve) =>
					window.setTimeout(() => resolve(options), 500),
				);
				const promise2 = new Promise<User[]>((resolve) =>
					window.setTimeout(() => resolve(options2), 1000),
				);
				const loadOptions = (search?: string) => (search === 'a' ? promise1 : promise2);
				const component = shallowUserPicker({ loadOptions });
				const select = component.find(Select);
				select.simulate('inputChange', 'a', { action: 'input-change' });
				jest.runAllTimers();
				return promise1.then(() => {
					jest.runAllTimers();
					expect(component.state()).toMatchObject({
						options,
					});
					select.simulate('inputChange', 'n', { action: 'input-change' });
					return promise2.then(() => {
						jest.runAllTimers();
						expect(component.state()).toMatchObject({
							options: options2,
						});
					});
				});

				await expect(document.body).toBeAccessible();
			});

			it('should finish resolving even when loadOptions errors', async () => {
				const usersPromise = new Promise<User[]>((_, reject) =>
					window.setTimeout(() => reject('Bad loadOptions'), 500),
				);
				const longerPromise = new Promise((resolve) => window.setTimeout(() => resolve(1), 1000));
				const loadOptions = jest.fn(() => usersPromise);
				const component = shallowUserPicker({ loadOptions });

				const select = component.find(Select);
				select.simulate('inputChange', 'a', { action: 'input-change' });
				jest.runAllTimers();
				return usersPromise
					.catch(() => longerPromise)
					.then(() => {
						expect(component.state()).toMatchObject({
							resolving: false,
						});
					});

				await expect(document.body).toBeAccessible();
			});

			it('should call props.onInputChange', async () => {
				const onInputChange = jest.fn();
				const component = shallowUserPicker({ onInputChange });
				const select = component.find(Select);
				select.simulate('inputChange', 'some text', { action: 'input-change' });
				expect(onInputChange).toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});

			it('should call props.onInputChange with controlled search', async () => {
				const onInputChange = jest.fn();
				const component = shallowUserPicker({ onInputChange, search: 'text' });
				const select = component.find(Select);
				select.simulate('inputChange', 'some text', { action: 'input-change' });
				expect(onInputChange).toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});

			it('should debounce input change events', async () => {
				const usersPromise = new Promise<User[]>((resolve) =>
					window.setTimeout(() => resolve(options), 500),
				);
				const loadOptions = jest.fn(() => usersPromise);
				shallowUserPicker({ loadOptions });

				expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 200);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('with session id', () => {
			beforeEach(() => {
				mockSessionId('random-session-id');
			});

			it('should pass sessionId to load option', async () => {
				const loadOptions = jest.fn(() => Promise.resolve(options));
				const component = mount(getBasePickerWithoutAnalytics({ loadOptions }));
				const input = component.find('input');
				input.simulate('focus');
				expect(loadOptions).toHaveBeenCalledWith('', 'random-session-id');

				await expect(document.body).toBeAccessible();
			});

			it('should pass session id on select when it starts opened', async () => {
				const onSelection = jest.fn();
				const component = mount(getBasePickerWithAnalytics({ onSelection, open: true }));
				const input = component.find(Select);
				input.props()['onChange']({ data: 'user-id' }, { action: 'select-option' });
				expect(onSelection).toHaveBeenCalledWith(
					'user-id',
					'random-session-id',
					expect.any(BaseUserPickerWithoutAnalytics),
				);

				await expect(document.body).toBeAccessible();
			});

			it('should pass session id on focus before open', async () => {
				const onFocus = jest.fn();
				const component = mount(getBasePickerWithAnalytics({ onFocus }));
				const input = component.find('input');
				input.simulate('focus');
				expect(onFocus).toHaveBeenCalledWith('random-session-id');

				await expect(document.body).toBeAccessible();
			});

			it('should use the same session id on 2nd focus', async () => {
				mockSessionId('session-first', 'mockReturnValueOnce');
				mockSessionId('session-second', 'mockReturnValueOnce');
				const onFocus = jest.fn();
				const component = mount(getBasePickerWithAnalytics({ onFocus }));
				const input = component.find('input');
				input.simulate('focus');
				await component.update();
				input.simulate('focus');
				await component.update();
				expect(onFocus).toHaveBeenCalledTimes(2);
				expect(onFocus).toHaveBeenCalledWith('session-first');

				await expect(document.body).toBeAccessible();
			});

			it('should use new session id for on focus if open is false', async () => {
				mockSessionId('session-first', 'mockReturnValueOnce');
				mockSessionId('session-second', 'mockReturnValueOnce');
				const onFocus = jest.fn();
				const component = mount(getBasePickerWithAnalytics({ onFocus, open: false }));
				const input = component.find('input');
				input.simulate('focus');
				await component.update();
				input.simulate('focus');
				await component.update();
				expect(onFocus).toHaveBeenCalledTimes(2);
				expect(onFocus.mock.calls).toMatchObject([['session-first'], ['session-second']]);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('with defaultOptions', () => {
			it('should render with default options', async () => {
				const component = shallowUserPicker({
					isMulti: true,
					defaultValue: [options[0]],
				});

				expect(component.find(Select).prop('value')).toEqual([
					{ label: 'Jace Beleren', data: options[0], value: ID_1 },
				]);

				await expect(document.body).toBeAccessible();
			});

			it('should render with default option', async () => {
				const component = shallowUserPicker({
					defaultValue: options[0],
				});

				expect(component.find(Select).prop('value')).toEqual({
					label: 'Jace Beleren',
					data: options[0],
					value: ID_1,
				});

				await expect(document.body).toBeAccessible();
			});

			it('should not render with default option if empty array', async () => {
				const component = shallowUserPicker({
					defaultValue: [],
				});

				expect(component.find(Select).prop('value')).toEqual(undefined);

				await expect(document.body).toBeAccessible();
			});

			it('should not render with default option if null', async () => {
				const component = shallowUserPicker({
					defaultValue: null,
				});

				expect(component.find(Select).prop('value')).toEqual(undefined);

				await expect(document.body).toBeAccessible();
			});

			it('should not render with default option if undefined', async () => {
				const component = shallowUserPicker({
					defaultValue: undefined,
				});

				expect(component.find(Select).prop('value')).toEqual(undefined);

				await expect(document.body).toBeAccessible();
			});

			it('should not remove fixed options', async () => {
				const onChange = jest.fn();
				const component = shallowUserPicker({
					isMulti: true,
					defaultValue: [{ ...options[0], fixed: true }],
					onChange,
				});

				const select = component.find(Select);
				const fixedOption = optionToSelectableOption({
					...options[0],
					fixed: true,
				});
				expect(select.prop('value')).toEqual([fixedOption]);

				select.simulate('change', [], {
					action: 'pop-value',
					removedValue: fixedOption,
				});

				expect(onChange).not.toHaveBeenCalled();

				expect(select.prop('value')).toEqual([fixedOption]);

				await expect(document.body).toBeAccessible();
			});

			it('should not remove fixed options with other values', async () => {
				const onChange = jest.fn();
				const fixedUser = { ...options[0], fixed: true };
				const component = shallowUserPicker({
					isMulti: true,
					defaultValue: [fixedUser],
					onChange,
				});

				const fixedOption = optionToSelectableOption(fixedUser);
				expect(component.find(Select).prop('value')).toEqual([fixedOption]);

				const removableOption = optionToSelectableOption(options[1]);
				component.find(Select).simulate('change', [fixedOption, removableOption], {
					action: 'select-option',
				});

				component.update();

				expect(component.find(Select).prop('value')).toEqual([fixedOption, removableOption]);

				expect(onChange).toHaveBeenCalledTimes(1);
				expect(onChange).toHaveBeenCalledWith([fixedUser, options[1]], 'select-option');

				onChange.mockClear();

				expect(component.find(Select).prop('value')).toEqual([fixedOption, removableOption]);

				component.find(Select).simulate('change', [removableOption], {
					action: 'pop-value',
					removedValue: fixedOption,
				});

				component.update();

				expect(onChange).not.toHaveBeenCalled();

				expect(component.find(Select).prop('value')).toEqual([fixedOption, removableOption]);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('props.open is true', () => {
			it('should call loadOptions', async () => {
				const loadOptions = jest.fn(() => []);
				shallowUserPicker({
					open: true,
					loadOptions,
				});

				expect(loadOptions).toHaveBeenCalledTimes(1);

				await expect(document.body).toBeAccessible();
			});

			it('should call loadOptions with props.search is passed in', async () => {
				const loadOptions = jest.fn(() => []);
				shallowUserPicker({
					open: true,
					loadOptions,
					search: 'test',
				});

				expect(loadOptions).toHaveBeenCalledWith('test', expect.any(String));

				await expect(document.body).toBeAccessible();
			});
		});

		describe('maxOptions', () => {
			it('should only pass maxOptions number of options to dropdown in single picker', async () => {
				const component = shallowUserPicker({
					options,
					open: true,
					maxOptions: 1,
				});

				expect(component.prop('options')).toHaveLength(1);
				expect(component.prop('options')[0]).toEqual(userOptions[0]);

				await expect(document.body).toBeAccessible();
			});

			it('should not display any options if maxOptions is zero', async () => {
				const component = shallowUserPicker({
					options,
					open: true,
					maxOptions: 0,
				});

				expect(component.prop('options')).toHaveLength(0);

				await expect(document.body).toBeAccessible();
			});

			it('should ignore negative number of maxOptions', async () => {
				const component = shallowUserPicker({
					options,
					open: true,
					maxOptions: -1,
				});

				expect(component.prop('options')).toHaveLength(2);

				await expect(document.body).toBeAccessible();
			});

			it('should only pass #maxOptions options to dropdown in multi picker', async () => {
				const component = shallowUserPicker({
					options,
					open: true,
					maxOptions: 1,
					isMulti: true,
				});

				expect(component.prop('options')).toHaveLength(1);
				expect(component.prop('options')[0]).toEqual(userOptions[0]);

				await expect(document.body).toBeAccessible();
			});

			it('should not consider selected options when passing maxOptions to dropdown', async () => {
				const component = shallowUserPicker({
					options,
					value: [options[0]],
					open: true,
					maxOptions: 1,
					isMulti: true,
				});
				expect(component.prop('options')).toHaveLength(1);
				expect(component.prop('options')[0]).toEqual(userOptions[1]);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('inputValue', () => {
			it('should set inputValue to empty string by default', async () => {
				const component = shallowUserPicker({ value: options[0] });
				expect(component.find(Select).prop('inputValue')).toEqual('');

				await expect(document.body).toBeAccessible();
			});

			it('onInputChange: should set inputValue to query', async () => {
				const component = shallowUserPicker();
				const select = component.find(Select);
				select.simulate('inputChange', 'some text', { action: 'input-change' });
				expect(component.find(Select).prop('inputValue')).toEqual('some text');

				await expect(document.body).toBeAccessible();
			});

			it('onBlur: should clear inputValue', async () => {
				const component = shallowUserPicker();
				const select = component.find(Select);
				select.simulate('blur');
				expect(component.find(Select).prop('inputValue')).toEqual('');

				await expect(document.body).toBeAccessible();
			});

			it('onChange: should clear inputValue', async () => {
				const component = shallowUserPicker();
				const select = component.find(Select);
				select.simulate('change', userOptions[0], { action: 'select-option' });
				expect(component.find(Select).prop('inputValue')).toEqual('');

				await expect(document.body).toBeAccessible();
			});

			it('single onFocus with value: should set inputValue to value', async () => {
				const component = shallowUserPicker({ value: options[0] });
				const select = component.find(Select);
				select.simulate('focus', { target: {} });
				expect(component.find(Select).prop('inputValue')).toEqual(options[0].name);

				await expect(document.body).toBeAccessible();
			});

			it('onFocus no value: should have set empty inputValue', async () => {
				const component = shallowUserPicker();
				const select = component.find(Select);
				select.simulate('focus', { target: {} });
				expect(component.find(Select).prop('inputValue')).toEqual('');

				await expect(document.body).toBeAccessible();
			});

			it('multi onFocus with value: should have empty inputValue', async () => {
				const component = shallowUserPicker({
					value: options[0],
					isMulti: true,
				});
				const select = component.find(Select);
				select.simulate('focus', { target: {} });
				expect(component.find(Select).prop('inputValue')).toEqual('');

				await expect(document.body).toBeAccessible();
			});

			it('should highlight input value on focus', async () => {
				const component = shallowUserPicker({ value: options[0] });
				const select = component.find(Select);
				const highlightInput = jest.fn();
				const input = document.createElement('input') as HTMLInputElement;
				input.setSelectionRange = highlightInput;
				select.simulate('focus', { target: input });
				expect(highlightInput).toBeCalledTimes(1);
				expect(highlightInput).toBeCalledWith(0, 12);

				await expect(document.body).toBeAccessible();
			});

			it('should clear inputValue on change after focus', async () => {
				const component = shallowUserPicker({ value: options[0] });
				const select = component.find(Select);
				select.simulate('focus', {});
				select.simulate('change', null, { action: 'clear' });
				component.update();
				expect(component.find(Select).prop('inputValue')).toBe('');

				await expect(document.body).toBeAccessible();
			});
		});

		it('should blur on escape', async () => {
			const component = shallowUserPicker();
			component.setState({ menuIsOpen: true });
			const ref = { blur: jest.fn() };
			(component.instance() as any).handleSelectRef(ref);

			component.find(Select).simulate('keyDown', { keyCode: 27 });
			expect(ref.blur).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should prevent default selection event when user inserts space on empty input', async () => {
			const component = shallowUserPicker({ options });
			component.setState({ menuIsOpen: true });
			const preventDefault = jest.fn();
			component.find(Select).simulate('keyDown', { keyCode: 32, preventDefault });
			expect(preventDefault).toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should not prevent default event when there is inputValue', async () => {
			const component = shallowUserPicker({ options });
			component.setState({ menuIsOpen: true, inputValue: 'test' });
			const preventDefault = jest.fn();
			component.find(Select).simulate('keyDown', { keyCode: 32, preventDefault });
			expect(preventDefault).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});

		describe('groups, teams, and custom', () => {
			const teamOptions: Team[] = [
				{
					id: 'team-123',
					name: 'The A team',
					type: 'team',
					memberCount: 1,
				},
				{
					id: 'team-abc',
					name: 'The B team',
					type: 'team',
					includesYou: true,
				},
			];

			const groupOptions: Group[] = [
				{ id: 'group-90210', name: 'the-bae-goals-group', type: 'group' },
				{ id: 'group-111', name: 'groups-that-group-groups', type: 'group' },
			];

			const selectableTeamOptions: Option[] = optionToSelectableOptions(teamOptions);
			const selectableGroupOptions: Option[] = optionToSelectableOptions(groupOptions);
			const selectableCustomOptions: Option[] = optionToSelectableOptions(customOptions);

			const mixedOptions: (OptionData | Custom)[] = (options as (OptionData | Custom)[])
				.concat(teamOptions)
				.concat(groupOptions)
				.concat(customOptions);

			const selectableMixedOptions: Option[] = optionToSelectableOptions(mixedOptions);

			it('should render select with only teams', async () => {
				const component = shallowUserPicker({ options: teamOptions });
				const select = component.find(Select);
				expect(select.prop('options')).toEqual(selectableTeamOptions);

				await expect(document.body).toBeAccessible();
			});

			it('should render select with only groups', async () => {
				const component = shallowUserPicker({ options: groupOptions });
				const select = component.find(Select);
				expect(select.prop('options')).toEqual(selectableGroupOptions);

				await expect(document.body).toBeAccessible();
			});

			it('should render select with only custom options', async () => {
				const component = shallowUserPicker({ options: customOptions });
				const select = component.find(Select);
				expect(select.prop('options')).toEqual(selectableCustomOptions);

				await expect(document.body).toBeAccessible();
			});

			it('should render select with teams, groups, custom, and users', async () => {
				const component = shallowUserPicker({ options: mixedOptions });
				const select = component.find(Select);
				expect(select.prop('options')).toEqual(selectableMixedOptions);

				await expect(document.body).toBeAccessible();
			});

			it('should be able to multi-select a mix of teams, groups, custom, and users', async () => {
				const onChange = jest.fn();
				const component = shallowUserPicker({
					options: mixedOptions,
					isMulti: true,
					onChange,
				});

				component.find(Select).simulate('change', selectableMixedOptions, {
					action: 'select-option',
				});

				expect(onChange).toHaveBeenCalledWith(mixedOptions.slice(0, 8), 'select-option');

				await expect(document.body).toBeAccessible();
			});

			it('should not group options by type if groupByTypeOrder is undefined', async () => {
				const component = shallowUserPicker({
					options: mixedOptions,
				});
				const select = component.find(Select);
				expect(select.prop('options')).toEqual(selectableMixedOptions);

				await expect(document.body).toBeAccessible();
			});

			it('should group options by type if groupByTypeOrder is passed', async () => {
				const component = shallowUserPicker({
					options: mixedOptions,
					groupByTypeOrder: ['team', 'group'],
				});
				const select = component.find(Select);
				const expectFormattedMessage = (defaultMessage: string) =>
					expect.objectContaining({
						props: expect.objectContaining({
							defaultMessage,
						}),
					});

				expect(select.prop('options')).toEqual([
					{
						label: expectFormattedMessage('Teams'),
						options: optionToSelectableOptions(teamOptions),
					},
					{
						label: expectFormattedMessage('Groups'),
						options: optionToSelectableOptions(groupOptions),
					},
				]);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('analytics', () => {
			const onEvent = jest.fn();

			const createEventMatcher = (
				actionSubject: string,
				action: string,
				analyticAttributes: { [key: string]: any },
			) =>
				expect.objectContaining({
					payload: expect.objectContaining({
						action,
						actionSubject,
						attributes: expect.objectContaining({
							...analyticAttributes,
						}),
					}),
				});

			const AnalyticsTestComponent = (props: Partial<UserPickerProps>) => (
				<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
					{getBasePickerWithAnalytics(props)}
				</AnalyticsListener>
			);

			let component: ReactWrapper;

			beforeEach(() => {
				component = mount(<AnalyticsTestComponent />);
			});

			afterEach(() => {
				onEvent.mockClear();
			});

			it('should trigger cancel event', async () => {
				const input = component.find('input');
				input.simulate('focus');
				input.simulate('blur');
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'cancelled',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								sessionDuration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								sessionId: expect.any(String),
								journeyId: expect.any(String),
								queryLength: 0,
								spaceInQuery: false,
								pickerType: 'single',
								upKeyCount: 0,
								downKeyCount: 0,
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger pressed event', async () => {
				const input = component.find('input');
				input.simulate('focus');
				component.setProps({ options });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 38 });
				input.simulate('keyDown', { keyCode: 13 });
				component.find(Select).prop('onChange')(optionToSelectableOption(options[0]), {
					action: 'select-option',
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'pressed',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								sessionDuration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								sessionId: expect.any(String),
								journeyId: expect.any(String),
								queryLength: 0,
								spaceInQuery: false,
								pickerType: 'single',
								upKeyCount: 1,
								downKeyCount: 3,
								position: 0,
								numberOfResults: 2,
								result: { id: ID_1, type: UserType },
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger clicked event', async () => {
				const input = component.find('input');
				input.simulate('focus');
				component.setProps({ options });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 38 });
				component.find(Select).prop('onChange')(optionToSelectableOption(options[0]), {
					action: 'select-option',
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								sessionDuration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								journeyId: expect.any(String),
								sessionId: expect.any(String),
								queryLength: 0,
								spaceInQuery: false,
								pickerType: 'single',
								upKeyCount: 1,
								downKeyCount: 3,
								position: 0,
								numberOfResults: 2,
								result: { id: ID_1, type: UserType },
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger clicked event for external user', async () => {
				const input = component.find('input');
				input.simulate('focus');
				component.setProps({ externalOptions });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 38 });
				component.find(Select).prop('onChange')(optionToSelectableOption(externalOptions[0]), {
					action: 'select-option',
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								sessionDuration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								journeyId: expect.any(String),
								sessionId: expect.any(String),
								queryLength: 0,
								spaceInQuery: false,
								pickerType: 'single',
								upKeyCount: 1,
								downKeyCount: 3,
								position: -1,
								numberOfResults: 0,
								result: {
									id: ID_2,
									type: 'external_user',
									sources: ['google'],
								},
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger clicked event for custom option with analyticsEvent override', async () => {
				const input = component.find('input');
				input.simulate('focus');
				component.setProps({ customOptions });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 40 });
				input.simulate('keyDown', { keyCode: 38 });
				component.find(Select).prop('onChange')(optionToSelectableOption(customOptions[0]), {
					action: 'select-option',
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'clicked',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								sessionDuration: expect.any(Number),
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								journeyId: expect.any(String),
								sessionId: expect.any(String),
								queryLength: 0,
								spaceInQuery: false,
								pickerType: 'single',
								upKeyCount: 1,
								downKeyCount: 3,
								position: -1,
								numberOfResults: 0,
								result: {
									id: ID_3,
									type: 'experiment',
								},
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger cleared event', async () => {
				const input = component.find('input');
				input.simulate('focus');
				component.find(Select).prop('onChange')(optionToSelectableOption(options[0]), {
					action: 'clear',
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'cleared',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: {
								context: 'test',
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								journeyId: expect.any(String),
								sessionId: expect.any(String),
								values: [],
								pickerType: 'single',
								pickerOpen: true,
							},
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger deleted event', async () => {
				render(<AnalyticsTestComponent value={[options[0]]} isMulti />);
				act(() => screen.getByRole('combobox').focus());
				act(() => screen.getByRole('button', { name: /, remove/ }).click());
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'deleted',
							actionSubject: 'userPickerItem',
							eventType: 'ui',
							attributes: {
								context: 'test',
								packageName: expect.any(String),
								packageVersion: expect.any(String),
								journeyId: expect.any(String),
								sessionId: expect.any(String),
								pickerOpen: true,
								value: { id: options[0].id, type: UserType },
							},
						}),
					}),
					'fabric-elements',
				);

				// eslint-disable-next-line @atlassian/a11y/no-violation-count
				await expect(document.body).toBeAccessible({ violationCount: 1 });
			});

			it('should trigger deleted event with email id set to null', async () => {
				component = mount(<AnalyticsTestComponent value={[emailValue]} isMulti />);
				component.setProps({ isMulti: true });
				component.find(Select).prop('onFocus')();
				component.find(Select).prop('onChange')([], {
					action: 'remove-value',
					removedValue: optionToSelectableOption(emailValue),
				});
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'deleted',
							actionSubject: 'userPickerItem',
							attributes: expect.objectContaining({
								value: { id: null, type: EmailType },
							}),
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			it('should not trigger deleted event if there was no removed value', async () => {
				component.setProps({ isMulti: true });
				component.find(Select).prop('onFocus')();
				component.find(Select).prop('onChange')([], {
					action: 'pop-value',
					removedValue: undefined,
				});
				expect(onEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'deleted',
						}),
					}),
				);

				await expect(document.body).toBeAccessible();
			});

			it('should trigger failed event', async () => {
				component.setProps({
					loadOptions: () => Promise.reject(new Error('some error')),
				});
				const input = component.find('input');
				input.simulate('focus');
				onEvent.mockClear();
				return Promise.resolve()
					.then()
					.then(() => {
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({
									action: 'failed',
									actionSubject: 'userPicker',
									eventType: 'operational',
									attributes: {
										context: 'test',
										packageName: expect.any(String),
										packageVersion: expect.any(String),
										pickerType: 'single',
										journeyId: expect.any(String),
										sessionId: expect.any(String),
									},
								}),
							}),
							'fabric-elements',
						);
					});

				await expect(document.body).toBeAccessible();
			});

			it('should set emailId to null for focused event', async () => {
				component = mount(<AnalyticsTestComponent value={emailValue} />);
				component.setProps({
					open: true,
				});

				component.update();
				await Promise.resolve();

				expect(onEvent).toHaveBeenCalledTimes(1);
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: expect.objectContaining({
							action: 'focused',
							actionSubject: 'userPicker',
							eventType: 'ui',
							attributes: expect.objectContaining({
								values: [{ id: null, type: EmailType }],
							}),
						}),
					}),
					'fabric-elements',
				);

				await expect(document.body).toBeAccessible();
			});

			describe('searched event', () => {
				it('should fire when opening menu with options', async () => {
					component.setProps({
						open: true,
						options,
					});
					return Promise.resolve().then(() => {
						expect(onEvent).toHaveBeenCalledTimes(2);
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({
									action: 'searched',
									actionSubject: 'userPicker',
									eventType: 'operational',
									attributes: expect.objectContaining({
										context: 'test',
										packageVersion: expect.any(String),
										packageName: expect.any(String),
										journeyId: expect.any(String),
										sessionId: expect.any(String),
										sessionDuration: expect.any(Number),
										durationSinceInputChange: expect.any(Number),
										queryLength: 0,
										results: [
											{ id: ID_1, type: UserType },
											{ id: ID_2, type: UserType },
										],
										pickerType: 'single',
									}),
								}),
							}),
							'fabric-elements',
						);
					});

					await expect(document.body).toBeAccessible();
				});

				it('should not fire searched if the menu is not open', async () => {
					component.setProps({
						options: [options[0]],
					});
					component.update();

					return Promise.resolve().then(() => {
						expect(onEvent).not.toHaveBeenCalled();
					});

					await expect(document.body).toBeAccessible();
				});

				it('should not fire searched if there are no options', async () => {
					component.setProps({
						open: true,
					});
					component.update();

					return Promise.resolve().then(() => {
						// Focused event
						expect(onEvent).toHaveBeenCalledTimes(1);
						expect(onEvent).not.toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({
									action: 'searched',
								}),
							}),
						);
					});

					await expect(document.body).toBeAccessible();
				});

				it('should fire searched when options change', async () => {
					component.setProps({
						open: true,
						options,
					});

					onEvent.mockClear();

					component.setProps({
						options: [options[0]],
					});

					return Promise.resolve().then(() => {
						expect(onEvent).toHaveBeenCalledTimes(1);
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({
									action: 'searched',
									actionSubject: 'userPicker',
									eventType: 'operational',
									attributes: expect.objectContaining({
										context: 'test',
										packageVersion: expect.any(String),
										packageName: expect.any(String),
										journeyId: expect.any(String),
										sessionId: expect.any(String),
										sessionDuration: expect.any(Number),
										durationSinceInputChange: expect.any(Number),
										queryLength: 0,
										results: [{ id: ID_1, type: UserType }],
										pickerType: 'single',
									}),
								}),
							}),
							'fabric-elements',
						);
					});

					await expect(document.body).toBeAccessible();
				});

				it('should fire searched when value changed', async () => {
					component.setProps({
						open: true,
						options,
					});

					onEvent.mockClear();

					component
						.find(Select)
						.props()
						.onChange(
							[{ id: ID_1, name: 'Jace Beleren', publicName: 'jbeleren' }],
							'select-option',
						);

					return Promise.resolve().then(() => {
						expect(onEvent).toHaveBeenCalledTimes(1);
						expect(onEvent).toHaveBeenCalledWith(
							expect.objectContaining({
								payload: expect.objectContaining({
									action: 'searched',
									actionSubject: 'userPicker',
									eventType: 'operational',
									attributes: expect.objectContaining({
										context: 'test',
										packageVersion: expect.any(String),
										packageName: expect.any(String),
										journeyId: expect.any(String),
										sessionId: expect.any(String),
										sessionDuration: expect.any(Number),
										durationSinceInputChange: expect.any(Number),
										queryLength: 0,
										results: [
											{ id: ID_1, type: UserType },
											{ id: ID_2, type: UserType },
										],
										pickerType: 'single',
									}),
								}),
							}),
							'fabric-elements',
						);
					});

					await expect(document.body).toBeAccessible();
				});

				describe('with journeyId', () => {
					it('should have the same id for journey id and session id on focus', async () => {
						mockSessionId('session-first', 'mockReturnValueOnce');
						mockSessionId('random-id', 'mockReturnValueOnce');

						component.setProps({ isMulti: true });
						component.find(Select).prop('onFocus')();

						await Promise.resolve();
						expect(onEvent).toHaveBeenCalledTimes(1);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'focused', {
								journeyId: 'session-first',
								sessionId: 'session-first',
							}),
							'fabric-elements',
						);

						await expect(document.body).toBeAccessible();
					});
					it('should use different journey id on second focus', async () => {
						const firstMockSessionId = 'session-first';
						const secondMockSessionId = 'session-second';
						mockSessionId(firstMockSessionId, 'mockReturnValueOnce');
						mockSessionId(secondMockSessionId, 'mockReturnValueOnce');
						render(<AnalyticsTestComponent />);
						act(() => screen.getByRole('combobox').focus());
						act(() => screen.getByRole('combobox').blur());
						act(() => screen.getByRole('combobox').focus());

						await Promise.resolve();
						expect(onEvent).toHaveBeenCalledTimes(3);
						expect(onEvent).toHaveBeenNthCalledWith(
							1,
							createEventMatcher('userPicker', 'focused', {
								journeyId: firstMockSessionId,
								sessionId: firstMockSessionId,
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenNthCalledWith(
							2,
							createEventMatcher('userPicker', 'cancelled', {
								journeyId: firstMockSessionId,
								sessionId: firstMockSessionId,
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenNthCalledWith(
							3,
							createEventMatcher('userPicker', 'focused', {
								journeyId: secondMockSessionId,
								sessionId: secondMockSessionId,
							}),
							'fabric-elements',
						);

						await expect(document.body).toBeAccessible();
					});
					it('should use same journey id across multiple selects', async () => {
						const firstMockSessionId = 'session-first';
						const secondMockSessionId = 'session-second';
						mockSessionId(firstMockSessionId, 'mockReturnValueOnce');
						mockSessionId(secondMockSessionId, 'mockReturnValueOnce');
						component.setProps({ isMulti: true, options });
						component.find(Select).prop('onFocus')();
						component.find(Select).prop('onChange')(optionToSelectableOption(options[0]), {
							action: 'select-option',
						});
						component.find(Select).prop('onChange')(optionToSelectableOption(options[1]), {
							action: 'select-option',
						});

						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'focused', {
								journeyId: firstMockSessionId,
								sessionId: firstMockSessionId,
							}),
							'fabric-elements',
						);

						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'clicked', {
								journeyId: firstMockSessionId,
								sessionId: firstMockSessionId,
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'clicked', {
								journeyId: firstMockSessionId,
								sessionId: secondMockSessionId,
							}),
							'fabric-elements',
						);

						await expect(document.body).toBeAccessible();
					});
				});
			});
			describe('PII checks', () => {
				it('should set invalid ids as null for events containing ids fired when option is clicked', async () => {
					const invalidOption = mixedOptions.find((value) => value.id === INVALID_ID_1);
					if (invalidOption) {
						component.setProps({ options: mixedOptions, value: invalidOption });

						const input = component.find('input');
						input.simulate('focus');

						component.find(Select).prop('onChange')(optionToSelectableOption(invalidOption), {
							action: 'select-option',
						});

						// focused -> searched -> clicked
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'focused', {
								values: expect.arrayContaining([{ id: null, type: 'user' }]),
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'searched', {
								results: expect.arrayContaining([
									{ id: ID_1, type: 'user' },
									{ id: ID_2, type: 'user' },
									{ id: OLD_AAID, type: 'user' },
									{ id: GROUP_ID, type: 'group' },
									{ id: TEAM_ID, type: 'team' },
									{ id: CUSTOM_ID, type: 'custom' },
									{ id: null, type: 'user' },
									{ id: null, type: 'user' },
								]),
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'clicked', {
								result: { id: null, type: 'user' },
							}),
							'fabric-elements',
						);
						checkForPII(onEvent);
					} else {
						fail();
					}

					await expect(document.body).toBeAccessible();
				});

				it('should set invalid ids as null for events fired when selected values are cleared', async () => {
					// clear event only fired for single pickers
					const invalidOption = mixedOptions.find((value) => value.id === INVALID_ID_1);
					if (invalidOption) {
						component.setProps({
							options: mixedOptions,
							value: invalidOption,
						});

						const input = component.find('input');
						input.simulate('focus');

						component.find(Select).prop('onChange')(optionToSelectableOption(options[0]), {
							action: 'clear',
						});

						// focused -> cleared
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'focused', {
								values: expect.arrayContaining([{ id: null, type: 'user' }]),
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'cleared', {
								values: expect.arrayContaining([{ id: null, type: 'user' }]),
							}),
							'fabric-elements',
						);
						checkForPII(onEvent);
					} else {
						fail();
					}

					await expect(document.body).toBeAccessible();
				});

				it('should set invalid ids as null for events fired when selected user is removed', async () => {
					const validOption = mixedOptions.find((value) => value.id === ID_1);
					const invalidOption = mixedOptions.find((value) => value.id === INVALID_ID_1);
					if (validOption && invalidOption) {
						component.setProps({
							options: mixedOptions,
							value: [validOption, invalidOption],
						});

						const input = component.find('input');
						input.simulate('focus');

						component.find(Select).prop('onChange')(optionToSelectableOption(invalidOption), {
							action: 'remove-value',
							removedValue: optionToSelectableOption(invalidOption),
						});
						checkForPII(onEvent);

						// focused -> removed
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPicker', 'focused', {
								values: expect.arrayContaining([
									{ id: ID_1, type: 'user' },
									{ id: null, type: 'user' },
								]),
							}),
							'fabric-elements',
						);
						expect(onEvent).toHaveBeenCalledWith(
							createEventMatcher('userPickerItem', 'deleted', {
								value: { id: null, type: 'user' },
							}),
							'fabric-elements',
						);
					} else {
						fail();
					}

					await expect(document.body).toBeAccessible();
				});

				/**
				 * Checks for PII defined in the mock users.
				 * User-picker has been involved with PII leaks in analytics in the past.
				 * Please add this check when testing for event firing.
				 */
				const checkForPII = (mockOnEvent: jest.Mock) => {
					mockOnEvent.mock.calls.map((args) => {
						// payload is always the first argument
						const payloadString = JSON.stringify(args[0]);
						// check against defined mock users
						expect(payloadString).not.toMatch(`\"${INVALID_ID_1}\"`);
						expect(payloadString).not.toMatch(`\"${INVALID_ID_2}\"`);

						// general regex testing
						// check against full name
						expect(payloadString).not.toMatch(/\"[a-zA-Z]+ [a-zA-Z]+\"/);
						// check against email
						expect(payloadString).not.toMatch(
							/\"[a-zA-Z0-9_\-+\'`?=*%$#!\^{|}~.]+@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]+)\"/,
						);
					});
				};
			});
		});
	});

	describe('UFO', () => {
		beforeAll(() => {
			ufologger.enable();
		});

		afterAll(() => {
			ufologger.disable();
		});

		beforeEach(() => {
			jest.useFakeTimers();
			mockOptionsShown.mockReset();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		const getLoadOptions = () => {
			const usersPromise = new Promise<User[]>((resolve) =>
				window.setTimeout(() => resolve(options), 500),
			);
			const loadOptions: LoadOptions = jest.fn(() => usersPromise);
			const waitForAsyncOptionsToLoad = async () => {
				expect(loadOptions).toHaveBeenCalled();
				jest.runAllTimers();
				await usersPromise;
				jest.runAllTimers();
			};
			return { usersPromise, loadOptions, waitForAsyncOptionsToLoad };
		};

		it('should send a UFO success metric when list shown after focus', async () => {
			const wrapper = mount(getBasePickerWithoutAnalytics({}));

			// Focus in the user picker to trigger the users list being shown
			wrapper.find('input').simulate('focus');

			expect(mockOptionsShown.startSpy).toHaveBeenCalled();
			expect(mockOptionsShown.successSpy).toHaveBeenCalled();
			expect(mockOptionsShown.transitions).toStrictEqual([
				'NOT_STARTED',
				// Focused
				'STARTED',
				'SUCCEEDED',
			]);

			await expect(document.body).toBeAccessible();
		});

		it('should send a UFO success metric when list shown after focus, with the options being loaded async', async () => {
			const { loadOptions } = getLoadOptions();
			render(getBasePickerWithoutAnalytics({ loadOptions }));

			// Focus in the user picker to trigger the users list being shown
			act(() => screen.getByRole('combobox').focus());
			expect(mockOptionsShown.startSpy).toHaveBeenCalled();
			expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();

			// Wait for the async options to have loaded
			expect(loadOptions).toHaveBeenCalled();

			await screen.findByText(options[0].name);

			expect(mockOptionsShown.successSpy).toHaveBeenCalled();
			expect(mockOptionsShown.transitions).toStrictEqual([
				'NOT_STARTED',
				// Focused
				'STARTED',
				'SUCCEEDED',
			]);

			await expect(document.body).toBeAccessible();
		});

		it('should send a UFO success metric when list shown after focus AND typing, with the options being loaded async', async () => {
			const { loadOptions } = getLoadOptions();
			render(getBasePickerWithoutAnalytics({ loadOptions }));

			// Focus in the user picker to trigger the users list being shown
			act(() => screen.getByRole('combobox').focus());
			expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(0);
			expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

			// While the async option load from the "focus" is still loading, enter a text search as well
			fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } });
			expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
			expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

			await screen.findByText(options[0].name);

			expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.transitions).toStrictEqual([
				'NOT_STARTED',
				// Focused
				'STARTED',
				'ABORTED',
				// Text input
				'STARTED',
				'SUCCEEDED',
			]);

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});

		it('should abort the UFO metric if the input is blurred while the async options are still loading', async () => {
			const { loadOptions } = getLoadOptions();
			const wrapper = mount(getBasePickerWithoutAnalytics({ loadOptions }));

			// Focus in the user picker to trigger the users list being shown
			wrapper.find('input').simulate('focus');
			expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(0);
			expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

			// Blur the input while the async options are still loading
			wrapper.find('input').simulate('blur');

			expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);
			expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);
			expect(mockOptionsShown.transitions).toStrictEqual([
				'NOT_STARTED',
				// Focused
				'STARTED',
				// Blurred
				'ABORTED',
			]);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('ariaProps getter', () => {
		it('should extract aria attributes from props ', async () => {
			const props = {
				'aria-labelledby': 'aria-labeledby-test',
				'test-aria-false-property': 'false-property',
			} as Partial<BaseUserPickerProps>;

			render(getBasePickerWithoutAnalytics({ ...props }));
			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('aria-labelledby');
			expect(input).not.toHaveAttribute('test-aria-false-property');

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});

	describe('a11y', () => {
		it('should consolidate label and description id when both custom and standard props are provided', async () => {
			const props: Partial<UserPickerProps> & Partial<AriaAttributes> = {
				ariaLabelledBy: 'labelId',
				ariaDescribedBy: 'descriptionId',
				'aria-labelledby': 'labelId 2',
				'aria-describedby': 'descriptionId 2',
			};

			const component = shallowUserPicker(props);
			const select = component.find(Select);

			expect(select.prop('labelId')).toBe('labelId');
			expect(select.prop('descriptionId')).toBe('descriptionId');
			expect(select.prop('aria-labelledby')).toBe(undefined);
			expect(select.prop('aria-describedby')).toBe(undefined);

			await expect(document.body).toBeAccessible();
		});

		it('should consolidate label and description id when custom props are provided', async () => {
			const props: Partial<UserPickerProps> = {
				ariaLabelledBy: 'labelId',
				ariaDescribedBy: 'descriptionId',
			};

			const component = shallowUserPicker(props);
			const select = component.find(Select);

			expect(select.prop('labelId')).toBe('labelId');
			expect(select.prop('descriptionId')).toBe('descriptionId');
			expect(select.prop('aria-labelledby')).toBe(undefined);
			expect(select.prop('aria-describedby')).toBe(undefined);

			await expect(document.body).toBeAccessible();
		});

		it('should consolidate label and description id when standard props are provided', async () => {
			const props: Partial<UserPickerProps> & Partial<AriaAttributes> = {
				'aria-labelledby': 'labelId',
				'aria-describedby': 'descriptionId',
			};

			const component = shallowUserPicker(props);
			const select = component.find(Select);

			expect(select.prop('labelId')).toBe('labelId');
			expect(select.prop('descriptionId')).toBe('descriptionId');
			expect(select.prop('aria-labelledby')).toBe(undefined);
			expect(select.prop('aria-describedby')).toBe(undefined);

			await expect(document.body).toBeAccessible();
		});
	});
});
