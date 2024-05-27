import React from 'react';

import { render } from '@testing-library/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { JQLParseError } from '@atlaskit/jql-ast';

import {
  useEditorStateHasJqlError,
  useExternalMessages,
  useJqlError,
} from '../../state';
import { type ExternalMessagesNormalized } from '../../state/types';

import { useEditorViewIsInvalid } from './index';

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

type HookFunction<T> = [T, any];
const useJqlErrorMock = jest.fn<HookFunction<JQLParseError | null>, []>(() => [
  null,
  {},
]);
const useExternalMessagesMock = jest.fn<
  HookFunction<ExternalMessagesNormalized>,
  []
>(() => [normalizedExternalMessagesEmpty, {}]);
const useEditorStateHasJqlErrorMock = jest.fn<HookFunction<boolean>, []>(() => [
  false,
  {},
]);

const assertUseEditorViewIsInvalid = jest.fn();

const deps = [
  injectable(useJqlError, useJqlErrorMock),
  injectable(useExternalMessages, useExternalMessagesMock),
  injectable(useEditorStateHasJqlError, useEditorStateHasJqlErrorMock),
];

const Consumer = () => {
  assertUseEditorViewIsInvalid(useEditorViewIsInvalid());
  return null;
};

const renderConsumer = () => {
  return render(<Consumer />, {
    wrapper: p => <DiProvider use={deps} {...p} />,
  });
};

describe('useEditorViewIsInvalid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useJqlErrorMock.mockReturnValue([null, {}]);
    useExternalMessagesMock.mockReturnValue([
      normalizedExternalMessagesEmpty,
      {},
    ]);
    useEditorStateHasJqlErrorMock.mockReturnValue([false, {}]);
  });

  it('should return true when jqlError is present', () => {
    const unknownError = new JQLParseError('Some unknown error occurred.');
    useJqlErrorMock.mockReturnValue([unknownError, {}]);
    useEditorStateHasJqlErrorMock.mockReturnValue([true, {}]);

    renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(true);
  });

  it('should return true when externalMessages have errors', () => {
    useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);

    renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(true);
  });

  it('should return false when jqlError and errors from externalMessages are absent', () => {
    renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(false);
  });

  it('should return false when jqlError is present and the error is fixed in editor', () => {
    const unknownError = new JQLParseError('Some unknown error occurred.');
    useJqlErrorMock.mockReturnValue([unknownError, {}]);
    useEditorStateHasJqlErrorMock.mockReturnValue([true, {}]);

    const { rerender } = renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(true);

    useEditorStateHasJqlErrorMock.mockReturnValue([false, {}]);
    rerender(<Consumer />);
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(false);
  });

  it('should return false when the error has been fixed and externalMessages have errors', () => {
    const unknownError = new JQLParseError('Some unknown error occurred.');
    useJqlErrorMock.mockReturnValue([unknownError, {}]);
    useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
    useEditorStateHasJqlErrorMock.mockReturnValue([true, {}]);

    const { rerender } = renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(true);

    useEditorStateHasJqlErrorMock.mockReturnValue([false, {}]);
    rerender(<Consumer />);
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(false);
  });

  it('should return false when the error has been fixed and a new error is added', () => {
    const unknownError = new JQLParseError('Some unknown error occurred.');
    useJqlErrorMock.mockReturnValue([unknownError, {}]);
    useEditorStateHasJqlErrorMock.mockReturnValue([true, {}]);

    const { rerender } = renderConsumer();
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(true);

    useEditorStateHasJqlErrorMock.mockReturnValue([false, {}]);
    rerender(<Consumer />);
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(false);

    useEditorStateHasJqlErrorMock.mockReturnValue([true, {}]);
    rerender(<Consumer />);
    expect(assertUseEditorViewIsInvalid).toHaveBeenLastCalledWith(false);
  });
});
