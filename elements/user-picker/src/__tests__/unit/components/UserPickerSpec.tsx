jest.mock('../../../components/styles', () => ({
	getStyles: jest.fn(),
}));

jest.mock('../../../components/creatableEmailSuggestion', () => ({
	getCreatableSuggestedEmailProps: jest.fn(),
}));

jest.mock('../../../components/creatable', () => ({
	getCreatableProps: jest.fn(),
}));

jest.mock('../../../components/components', () => ({
	getComponents: jest
		.fn()
		.mockImplementation((multi?: boolean, anchor?: React.ComponentType<any>) =>
			jest.requireActual('../../../components/components').getComponents(multi, anchor),
		),
}));

jest.mock('../../../components/MessagesIntlProvider', () =>
	jest.fn().mockImplementation(({ children }) => children),
);

const mockMounted = new MockConcurrentExperienceInstance('user-picker-rendered');
const mockOptionsShown = new MockConcurrentExperienceInstance('user-picker-options-shown');
jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(experienceId: string): ConcurrentExperience => ({
			// @ts-expect-error partial getInstance mock
			getInstance: (_: string): Partial<UFOExperience> => {
				if (experienceId === 'user-picker-rendered') {
					return mockMounted;
				} else if (experienceId === 'user-picker-options-shown') {
					return mockOptionsShown;
				}
				throw new Error(
					`ConcurrentExperience used without id mocked in UserPickerSpec: ${experienceId}`,
				);
			},
		}),
	),
}));

jest.mock('@atlaskit/select', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/select'),
	CreatableSelect: () => {
		throw new Error('Error from inside CreatableSelect');
	},
}));

import Select, { CreatableSelect } from '@atlaskit/select';
import { shallow, mount } from 'enzyme';

import React from 'react';
import { type ConcurrentExperience, type UFOExperience, ufologger } from '@atlaskit/ufo';
import { getComponents } from '../../../components/components';
import { getCreatableProps } from '../../../components/creatable';
import { getCreatableSuggestedEmailProps } from '../../../components/creatableEmailSuggestion';
import { getStyles } from '../../../components/styles';
import { UserPickerWithoutAnalytics } from '../../../components/UserPicker';
import { type User, type UserPickerProps } from '../../../types';
import { MockConcurrentExperienceInstance } from '../_testUtils';
import { fireEvent, render } from '@testing-library/react';

const getStylesMock = getStyles as jest.MockedFunction<typeof getStyles>;

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };
jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: (descriptor: any) => <span>{descriptor.defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
	};
});

describe('UserPicker', () => {
	// dive twice to get to BaseUserPicker
	const shallowUserPicker = (props: Partial<UserPickerProps> = {}) =>
		shallow(<UserPickerWithoutAnalytics fieldId="test" {...props} />)
			.dive()
			.dive()
			.dive()
			.dive();

	const mountUserPicker = (props: Partial<UserPickerProps> = {}) =>
		mount(<UserPickerWithoutAnalytics fieldId="test" {...props} />);

	const options: User[] = [
		{
			id: 'abc-123',
			name: 'Jace Beleren',
			publicName: 'jbeleren',
		},
		{
			id: '123-abc',
			name: 'Chandra Nalaar',
			publicName: 'cnalaar',
		},
	];

	beforeEach(() => {
		getStylesMock.mockReset();
	});

	afterEach(() => {
		(getCreatableProps as jest.Mock).mockClear();
	});

	describe('default picker', () => {
		it('should render Select by default', async () => {
			const component = shallowUserPicker({ options }).dive();
			const select = component.find(Select);
			expect(select).toHaveLength(1);
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				false,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should set width', async () => {
			shallowUserPicker({ width: 500 });
			expect(getStylesMock).toHaveBeenCalledWith(
				500,
				false,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should set compact styles', async () => {
			shallowUserPicker({ appearance: 'compact' });
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				false,
				true,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should call getComponents with false if single picker', async () => {
			shallowUserPicker({ isMulti: false });
			expect(getComponents).toHaveBeenCalledWith(false, undefined, false, {});
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				false,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should call getComponents with true if multi picker', async () => {
			shallowUserPicker({ isMulti: true });
			expect(getComponents).toHaveBeenCalledWith(true, undefined, false, {});
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				true,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should call getComponents with components if components are passed', async () => {
			shallowUserPicker({
				isMulti: false,
				components: { Option: () => <div>Option</div> },
			});
			expect(getComponents).toHaveBeenCalledWith(false, undefined, false, {
				Option: expect.any(Function),
			});
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				false,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});

		it('should call getComponents with empty object if no components are passed', async () => {
			shallowUserPicker({
				isMulti: false,
				components: undefined,
			});
			expect(getComponents).toHaveBeenCalledWith(false, undefined, false, {});
			expect(getStylesMock).toHaveBeenCalledWith(
				350,
				false,
				false,
				undefined,
				false,
				false,
				undefined,
			);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('allowEmail', () => {
		beforeEach(() => {
			jest.unmock('@atlaskit/select');
		});

		it('should use CreatableSelect', async () => {
			const component = shallowUserPicker({ allowEmail: true }).dive();
			const select = component.find(CreatableSelect);
			expect(select).toHaveLength(1);
			expect(getCreatableProps).toHaveBeenCalledTimes(1);
			expect(getCreatableProps).toHaveBeenCalledWith(undefined);

			await expect(document.body).toBeAccessible();
		});

		it('should pass creatable props as pickerProps', async () => {
			const component = shallowUserPicker({ allowEmail: true }).dive();
			expect(getCreatableProps).toHaveBeenCalledTimes(1);
			expect(component.prop('pickerProps')).toEqual(getCreatableProps());

			await expect(document.body).toBeAccessible();
		});
	});

	describe('emailLabel', () => {
		it('should pass prop if allowEmail is true', async () => {
			const emailLabel = 'This is a test';
			const component = shallowUserPicker({ allowEmail: true, emailLabel });
			expect(component.dive().prop('emailLabel')).toBeDefined();
			expect(component.dive().prop('emailLabel')).toEqual(emailLabel);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('recommendedEmailDomain', () => {
		it('uses getCreatableRecommendedEmailProps instead of getCreatableProps', async () => {
			shallowUserPicker({
				allowEmail: true,
				suggestEmailsForDomain: 'test.com',
			});
			expect(getCreatableProps).toHaveBeenCalledTimes(0);
			expect(getCreatableSuggestedEmailProps).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
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
			mockMounted.mockReset();
		});

		it('should send a UFO success metric when mounted successfully', async () => {
			mountUserPicker();
			expect(mockMounted.startSpy).toHaveBeenCalled();
			expect(mockMounted.successSpy).toHaveBeenCalled();
			expect(mockMounted.transitions).toStrictEqual([
				'NOT_STARTED',
				// Mounted
				'STARTED',
				'SUCCEEDED',
			]);

			await expect(document.body).toBeAccessible();
		});

		it('should send a UFO failure metric when mount fails', async () => {
			expect(mockMounted.transitions).toStrictEqual(['NOT_STARTED']);
			mountUserPicker({
				// allowEmail:true causes CreatableSelect to be used,
				// which at the top of this file is mocked to throw an error
				allowEmail: true,
			});
			expect(mockMounted.startSpy).toHaveBeenCalled();
			expect(mockMounted.failureSpy).toHaveBeenCalled();
			expect(mockMounted.transitions).toStrictEqual([
				'NOT_STARTED',
				// Mounted but mount fails
				'STARTED',
				'FAILED',
			]);

			await expect(document.body).toBeAccessible();
		});
	});

	/**
	 * Tests the workaround for user-pickers in react-beautiful-dnd, which calls
	 * preventDefault on mouseDownCapture, preventing react-select from detecting clicks
	 **/
	describe('default picker with a parent calling preventDefault onMouseDownCapture', () => {
		const renderUserPickerWithPreventDefault = (props: Partial<UserPickerProps> = {}) =>
			render(
				<div onMouseDownCapture={(e) => e.preventDefault()}>
					<UserPickerWithoutAnalytics
						fieldId="test"
						UNSAFE_hasDraggableParentComponent={true}
						{...props}
					/>
				</div>,
			);

		it('should open and close Select when UNSAFE_hasDraggableParentComponent set to true', async () => {
			const onOpenMock = jest.fn();
			const onCloseMock = jest.fn();
			const { getByText } = renderUserPickerWithPreventDefault({
				options,
				onOpen: onOpenMock,
				onClose: onCloseMock,
			});

			const selectValueContainer = getByText('Enter people or teams...').parentElement;

			// Open user picker
			fireEvent.mouseDown(selectValueContainer!);
			expect(onOpenMock).toHaveBeenCalledTimes(1);

			// Close user picker
			fireEvent.mouseDown(selectValueContainer!);
			expect(onCloseMock).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should open user picker when openMenuOnClick is false', async () => {
			const onOpenMock = jest.fn();
			const { getByText } = renderUserPickerWithPreventDefault({
				options,
				onOpen: onOpenMock,
				openMenuOnClick: false,
			});

			const selectValueContainer = getByText('Enter people or teams...').parentElement;

			// Open user picker
			fireEvent.mouseDown(selectValueContainer!);
			expect(onOpenMock).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should not open user picker when openMenuOnClick is true', async () => {
			const onOpenMock = jest.fn();
			const { getByText } = renderUserPickerWithPreventDefault({
				options,
				onOpen: onOpenMock,
				openMenuOnClick: true,
			});

			const selectValueContainer = getByText('Enter people or teams...').parentElement;

			// Open user picker
			fireEvent.mouseDown(selectValueContainer!);
			expect(onOpenMock).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});
	});
});
