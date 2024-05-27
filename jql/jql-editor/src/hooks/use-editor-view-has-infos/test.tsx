import React from 'react';

import { render } from '@testing-library/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useExternalMessages } from '../../state';
import { type ExternalMessagesNormalized } from '../../state/types';

import { useEditorViewHasInfos } from './index';

const normalizedExternalMessagesEmpty: ExternalMessagesNormalized = {
  errors: [],
  warnings: [],
  infos: [],
};

const normalizedExternalMessages: ExternalMessagesNormalized = {
  errors: [],
  warnings: [],
  infos: [{ type: 'info', message: 'sup' }],
};

const useExternalMessagesMock = jest.fn<[ExternalMessagesNormalized, any], []>(
  () => [normalizedExternalMessagesEmpty, {}],
);

const assertEditorViewHasInfos = jest.fn();

const deps = [injectable(useExternalMessages, useExternalMessagesMock)];

const Consumer = () => {
  assertEditorViewHasInfos(useEditorViewHasInfos());
  return null;
};

const renderConsumer = () => {
  return render(<Consumer />, {
    wrapper: p => <DiProvider use={deps} {...p} />,
  });
};

describe('useEditorViewHasInfos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useExternalMessagesMock.mockReturnValue([
      normalizedExternalMessagesEmpty,
      {},
    ]);
  });

  it('should return true when externalMessages contain info messages', () => {
    useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
    renderConsumer();
    expect(assertEditorViewHasInfos).toHaveBeenLastCalledWith(true);
  });

  it('should return false when externalMessages does not contain info messages', () => {
    renderConsumer();
    expect(assertEditorViewHasInfos).toHaveBeenLastCalledWith(false);
  });
});
