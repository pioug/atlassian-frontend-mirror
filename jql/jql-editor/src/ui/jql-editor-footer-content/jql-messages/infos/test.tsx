import React, { type ReactNode } from 'react';

import { render } from '@testing-library/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useExternalMessages } from '../../../../state';
import { type ExternalMessagesNormalized } from '../../../../state/types';

import { InfoMessages, useFormattedInfoMessage } from './index';

const useFormattedInfoMessageMock = jest.fn<ReactNode, []>(() => null);

describe('InfoMessages', () => {
  const deps = [
    injectable(useFormattedInfoMessage, useFormattedInfoMessageMock),
  ];

  const renderInfoMessages = () => {
    return render(<InfoMessages />, {
      wrapper: p => <DiProvider use={deps} {...p} />,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render infos if the useFormattedInfoMessage returns null', () => {
    useFormattedInfoMessageMock.mockReturnValue(null);
    const { container } = renderInfoMessages();
    expect(container.firstChild).toBeNull();
  });

  it('should not render infos if the useFormattedInfoMessage returns a non null result', () => {
    useFormattedInfoMessageMock.mockReturnValue(<>infos</>);
    const { getByText } = renderInfoMessages();
    expect(getByText('infos')).toBeInTheDocument();
  });
});

describe('useFormattedInfoMessage', () => {
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

  const useExternalMessagesMock = jest.fn<
    [ExternalMessagesNormalized, any],
    []
  >(() => [normalizedExternalMessagesEmpty, {}]);

  const deps = [injectable(useExternalMessages, useExternalMessagesMock)];

  const Consumer = () => {
    return <>{useFormattedInfoMessage()}</>;
  };

  const renderConsumer = () => {
    return render(<Consumer />, {
      wrapper: p => <DiProvider use={deps} {...p} />,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useExternalMessagesMock.mockReturnValue([
      normalizedExternalMessagesEmpty,
      {},
    ]);
  });

  it('should render null if no messages are present', () => {
    const { container } = renderConsumer();
    expect(container.firstChild).toBeNull();
  });

  it('should render external messages if present', () => {
    useExternalMessagesMock.mockReturnValue([normalizedExternalMessages, {}]);
    const { getByText } = renderConsumer();
    expect(getByText('sup')).toBeInTheDocument();
  });

  it('should render more than one external message if present', () => {
    useExternalMessagesMock.mockReturnValue([
      {
        ...normalizedExternalMessages,
        infos: [
          ...normalizedExternalMessages.infos,
          ...normalizedExternalMessages.infos,
        ],
      },
      {},
    ]);
    const { getAllByText } = renderConsumer();
    expect(getAllByText('sup')).toHaveLength(2);
  });
});
