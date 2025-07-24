import React from 'react';

import { fireEvent, render, type RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Form from '@atlaskit/form';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	useValidateAqlText,
	type UseValidateAqlTextState,
} from '../../../../../hooks/useValidateAqlText';
import { AqlSearchInput } from '../index';

jest.mock('../../../../../hooks/useValidateAqlText');

const onSubmitMock = jest.fn();

const formWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
	<IntlProvider locale="en">
		<Form onSubmit={onSubmitMock}>{({ formProps }) => <form {...formProps}>{children}</form>}</Form>
	</IntlProvider>
);

const mockValidateAqlText = jest.fn();
const mockDebouncedValidation = jest.fn();
const getUseValidateAqlTextDefaultHookState: UseValidateAqlTextState = {
	lastValidationResult: { type: 'idle' },
	validateAqlText: mockValidateAqlText,
	debouncedValidation: mockDebouncedValidation,
};

describe('AqlSearchInput', () => {
	const workspaceId = 'workspaceId';
	const searchInputTestId = 'assets-datasource-modal--aql-search-input';
	const renderDefaultAqlSearchInput = async (
		validateAqlTextHookState?: UseValidateAqlTextState,
	) => {
		let renderFunction = render;
		asMock(useValidateAqlText).mockReturnValue(
			validateAqlTextHookState || getUseValidateAqlTextDefaultHookState,
		);
		const renderComponent = () =>
			renderFunction(<AqlSearchInput isSearching={false} workspaceId={workspaceId} value={''} />, {
				wrapper: formWrapper,
			});
		return {
			...renderComponent(),
		};
	};

	beforeEach(() => {
		jest.resetAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	describe('field validation', () => {
		it('should call onSubmit on button click when aql string is valid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'valid', validatedAql: 'valid query' },
			});
			const button = await findByTestId('assets-datasource-modal--aql-search-button');
			await button.click();
			expect(onSubmitMock).toHaveBeenCalled();
		});

		it('should not call onSubmit on button click when aql string is invalid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'invalid',
					error: 'A validation error message',
				},
			});
			const button = await findByTestId('assets-datasource-modal--aql-search-button');
			await button.click();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should not call onSubmit on button click when validation is loading', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'loading',
				},
			});
			const button = await findByTestId('assets-datasource-modal--aql-search-button');
			await button.click();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should not call onSubmit on button click when validation is idle', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'idle',
				},
			});
			const button = await findByTestId('assets-datasource-modal--aql-search-button');
			await button.click();
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should not call onSubmit on enter keypress when aql string is invalid', async () => {
			const { getByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'invalid',
					error: 'A validation error message',
				},
			});
			const textInput = getByTestId(searchInputTestId);
			fireEvent.focus(textInput);
			fireEvent.keyPress(textInput, { key: 'Enter', code: 13, charCode: 13 });
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should not call onSubmit on enter keypress when validation is loading', async () => {
			const { getByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'loading',
				},
			});
			const textInput = getByTestId(searchInputTestId);
			fireEvent.focus(textInput);
			fireEvent.keyPress(textInput, { key: 'Enter', code: 13, charCode: 13 });
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should not call onSubmit on enter keypress when validation is idle', async () => {
			const { getByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'idle',
				},
			});
			const textInput = getByTestId(searchInputTestId);
			fireEvent.focus(textInput);
			fireEvent.keyPress(textInput, { key: 'Enter', code: 13, charCode: 13 });
			expect(onSubmitMock).not.toHaveBeenCalled();
		});

		it('should show a validation error message when a message is given', async () => {
			const { findByTestId, getByText } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: {
					type: 'invalid',
					error: 'A validation error message',
				},
			});
			const button = await findByTestId('assets-datasource-modal--aql-search-button');
			await button.click();
			expect(onSubmitMock).not.toHaveBeenCalled();
			expect(getByText('A validation error message')).toBeInTheDocument();
		});
	});

	describe('renderValidatorIcon', () => {
		it('should show idle icon when validation result is idle', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput();
			expect(await findByTestId('assets-datasource-modal--aql-idle')).toBeInTheDocument();
		});

		it('should show help icon', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput();
			expect(await findByTestId('assets-datasource-modal-help')).toBeInTheDocument();
		});

		it('should show correct icon when aql string is valid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'valid', validatedAql: 'valid query' },
			});
			expect(await findByTestId('assets-datasource-modal--aql-valid')).toBeInTheDocument();
		});

		it('should show correct icon when aql string is invalid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'invalid', error: '' },
			});
			expect(await findByTestId('assets-datasource-modal--aql-invalid')).toBeInTheDocument();
		});

		it('should show validating icon when fetching', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'loading' },
			});
			expect(await findByTestId('assets-datasource-modal--aql-validating')).toBeInTheDocument();
		});
	});

	describe('Submit button', () => {
		it('should disable submit button when AQL is invalid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'invalid', error: '' },
			});

			expect(await findByTestId('assets-datasource-modal--aql-search-button')).toBeDisabled();
		});

		it('should enable submit button when AQL is valid', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'valid', validatedAql: 'valid query' },
			});

			expect(await findByTestId('assets-datasource-modal--aql-search-button')).not.toBeDisabled();
		});

		it('should disable submit while AQL is being validated', async () => {
			const { findByTestId } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'loading' },
			});

			expect(await findByTestId('assets-datasource-modal--aql-search-button')).toBeDisabled();
		});
	});
	ffTest.on('fix_a11y_issues_inline_edit', '', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = await renderDefaultAqlSearchInput({
				...getUseValidateAqlTextDefaultHookState,
				lastValidationResult: { type: 'loading' },
			});
			await expect(container).toBeAccessible();
		});
	});
});
