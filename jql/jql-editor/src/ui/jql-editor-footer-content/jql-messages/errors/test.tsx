import React from 'react';

import { render } from '@testing-library/react';
import noop from 'lodash/noop';
import { type IntlShape } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import { JQLParseError, JQLSyntaxError } from '@atlaskit/jql-ast';

import { mockIntl } from '../../../../../mocks';
import { commonMessages } from '../../../../common/messages';
import { useEditorViewIsInvalid } from '../../../../hooks/use-editor-view-is-invalid';
import { useExternalMessages, useIntl, useJqlError, useStoreActions } from '../../../../state';
import { type ExternalMessagesNormalized } from '../../../../state/types';

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

const deps = [
	injectable(useIntl, (): [IntlShape, any] => [mockIntl, {}]),
	injectable(useJqlError, useJQLErrorMock),
	injectable(useExternalMessages, useExternalMessagesMock),
	injectable(useStoreActions, useStoreActionsMock),
	injectable(useEditorViewIsInvalid, useEditorViewIsInvalidMock),
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
