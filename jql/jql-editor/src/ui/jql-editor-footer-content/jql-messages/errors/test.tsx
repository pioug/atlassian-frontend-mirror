import React from 'react';

import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import { type IntlShape } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { JQLParseError, JQLSyntaxError } from '@atlaskit/jql-ast';

import { mockIntl } from '../../../../../mocks';
import { JQL_EDITOR_VALIDATION_ID } from '../../../../common/constants';
import { commonMessages } from '../../../../common/messages';
import { useEditorViewIsInvalid } from '../../../../hooks/use-editor-view-is-invalid';
import {
	useCustomErrorComponent,
	useExternalMessages,
	useIntl,
	useJqlError,
	useStoreActions,
} from '../../../../state';
import { CustomErrorComponent, type ExternalMessagesNormalized } from '../../../../state/types';

import { ErrorMessages } from './index';

const normalizedExternalMessagesEmpty: ExternalMessagesNormalized = {
	errors: [],
	warnings: [],
	infos: [],
};

const normalizedExternalMessages: ExternalMessagesNormalized = {
	errors: [
		{
			type: 'error',
			message: `The value 'ABC' does not exist for the field 'project'`,
		},
		{
			type: 'error',
			message: `A value with ID '123' does not exist for the field 'issuetype'`,
		},
		{
			type: 'error',
			message: `Unable to find JQL function 'someFakeFunction()`,
		},
	],
	warnings: [],
	infos: [],
};

const useJQLErrorMock = jest.fn<[JQLParseError | null, any], []>(() => [null, {}]);

const useExternalMessagesMock = jest.fn<[ExternalMessagesNormalized, any], []>(() => [
	normalizedExternalMessagesEmpty,
	{},
]);

const useStoreActionsMock = jest.fn<[null, any], []>(() => [
	null,
	{ externalErrorMessageViewed: noop },
]);

const useEditorViewIsInvalidMock = jest.fn<boolean, []>(() => false);

const useCustomErrorComponentMock = jest.fn<[CustomErrorComponent | undefined, any], []>(() => [
	() => null,
	{},
]);

const deps = [
	injectable(useIntl, (): [IntlShape, any] => [mockIntl, {}]),
	injectable(useJqlError, useJQLErrorMock),
	injectable(useExternalMessages, useExternalMessagesMock),
	injectable(useStoreActions, useStoreActionsMock),
	injectable(useEditorViewIsInvalid, useEditorViewIsInvalidMock),
	injectable(useCustomErrorComponent, useCustomErrorComponentMock),
];

const renderErrorMessages = () => {
	return render(<ErrorMessages />, {
		wrapper: (p) => <DiProvider use={deps} {...p} />,
	});
};

const syntaxError = new JQLSyntaxError('The quoted string has not been completed.', 1, 1, 1, 1);

const unknownError = new JQLParseError('Some unknown error occurred.');

describe('ErrorMessages', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useJQLErrorMock.mockReturnValue([null, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(false);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessagesEmpty, {}]);
		useCustomErrorComponentMock.mockReturnValue([undefined, {}]);
	});

	describe('Custom error component', () => {
		// Note: Most of these tests are only a smoke tests. We're essentially testing the mocks
		// However, These still are good tests to ensure basic things like errors not throwing and props being passed down correctly

		it('Uses custom component to override rendering', () => {
			const CustomErrorMessage: CustomErrorComponent = jest.fn((props) => {
				const { testId, editorTheme, editorId, children, errorMessages, validationId, ...rest } =
					props;

				// Expect some critical props to be passed down
				expect(testId).toBe('jql-editor-validation');
				expect(editorTheme).toStrictEqual({
					defaultMaxRows: expect.any(Number),
					expanded: expect.any(Boolean),
					expandedRows: expect.any(Number),
					isCompact: expect.any(Boolean),
					isSearch: expect.any(Boolean),
					toggleExpanded: expect.any(Function),
				});
				expect(editorId).toEqual(expect.any(String));
				expect(validationId).toContain('jql-editor-validation');
				expect(errorMessages?.[0].props?.children).toStrictEqual(
					'The quoted string has not been completed. (line 1, character 2)',
				);

				return <div {...rest}>{children}</div>;
			});

			useJQLErrorMock.mockReturnValue([syntaxError, {}]);
			useEditorViewIsInvalidMock.mockReturnValue(true);
			useCustomErrorComponentMock.mockReturnValue([CustomErrorMessage, {}]);

			renderErrorMessages();

			expect(CustomErrorMessage).toHaveBeenCalled();
			expect(screen.queryByTestId('jql-editor-validation')).toBeInTheDocument();
			expect(screen.queryByText(syntaxError.message, { exact: false })).toBeInTheDocument();
			expect(screen.queryByRole('alert')?.getAttribute('id')).toContain(JQL_EDITOR_VALIDATION_ID);
		});

		it('Does not use the custom component when errorMessage is empty', () => {
			const CustomErrorMessage = jest.fn(() => {
				return null;
			});

			useJQLErrorMock.mockReturnValue([null, {}]);
			useEditorViewIsInvalidMock.mockReturnValue(false);
			useCustomErrorComponentMock.mockReturnValue([CustomErrorMessage, {}]);

			renderErrorMessages();

			expect(CustomErrorMessage).not.toHaveBeenCalled();
			expect(screen.queryByTestId('jql-editor-validation')).not.toBeInTheDocument();
		});
	});

	it(`does not render an error message when there are no errors`, () => {
		const { queryByTestId } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).not.toBeInTheDocument();
	});

	it('renders JQL syntax errors', () => {
		useJQLErrorMock.mockReturnValue([syntaxError, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(true);
		const { queryByTestId, queryByText } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).toBeInTheDocument();
		expect(queryByText(syntaxError.message, { exact: false })).toBeInTheDocument();
	});

	it('renders external JQL errors', () => {
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(true);
		const { queryByTestId, queryByText } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[0].message))).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[1].message))).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[2].message))).toBeInTheDocument();
	});

	it(`renders the unknown error message when a JQL error exists but it's not a syntax error`, () => {
		useJQLErrorMock.mockReturnValue([unknownError, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(true);
		const { queryByTestId, queryByText } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).toBeInTheDocument();
		expect(queryByText(mockIntl.formatMessage(commonMessages.unknownError))).toBeInTheDocument();
	});

	it(`prioritises syntax errors over external JQL errors`, () => {
		useJQLErrorMock.mockReturnValue([syntaxError, {}]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(true);
		const { queryByTestId, queryByText } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).toBeInTheDocument();
		expect(queryByText(syntaxError.message, { exact: false })).toBeInTheDocument();
	});

	it(`prioritises external JQL errors over unknown errors`, () => {
		useJQLErrorMock.mockReturnValue([unknownError, {}]);
		useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(true);
		const { queryByTestId, queryByText } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[0].message))).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[1].message))).toBeInTheDocument();
		expect(queryByText(String(normalizedExternalMessages.errors[2].message))).toBeInTheDocument();
	});

	it('does not render an error message when there is an error but the editor view is marked as valid', () => {
		useJQLErrorMock.mockReturnValue([syntaxError, {}]);
		useEditorViewIsInvalidMock.mockReturnValue(false);
		const { queryByTestId } = renderErrorMessages();
		expect(queryByTestId('jql-editor-validation')).not.toBeInTheDocument();
	});
});
