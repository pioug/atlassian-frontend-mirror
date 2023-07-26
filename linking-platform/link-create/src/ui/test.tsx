import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';

import { LinkCreatePlugin, LinkCreateWithModalProps } from '../common/types';
import { useLinkCreateCallback } from '../controllers/callback-context';

import LinkCreate from './index';

const CreatePluginForm = () => {
  const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

  return (
    <div>
      This is a form. Trust me.
      <Button
        testId="submit-button"
        appearance="primary"
        onClick={() =>
          onCreate &&
          onCreate({
            url: 'https://www.atlassian.com',
            data: {
              spaceName: 'space',
            },
            objectId: '123',
            objectType: 'page',
          })
        }
      >
        Success
      </Button>
      <Button
        testId="error-button"
        appearance="primary"
        onClick={() => onFailure && onFailure(Error('An error just happened'))}
      >
        Trigger an error
      </Button>
      <Button testId="close-button" appearance="primary" onClick={onCancel}>
        Close
      </Button>
    </div>
  );
};

describe('<LinkCreate />', () => {
  let onCreateMock: jest.Mock;
  let onFailureMock: jest.Mock;
  let onCloseMock: jest.Mock;

  const testId = 'link-create';

  beforeEach(() => {
    onCreateMock = jest.fn();
    onFailureMock = jest.fn();
    onCloseMock = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const plugin: LinkCreatePlugin = {
    group: {
      label: 'group-label',
      icon: 'group-icon',
      key: 'group',
    },
    label: 'entity-label',
    icon: 'entity-icon',
    key: 'entity-key',
    form: <CreatePluginForm />,
  };

  const setUpLinkCreate = (props?: Partial<LinkCreateWithModalProps>) => {
    return render(
      <IntlProvider locale="en">
        <LinkCreate
          {...props}
          testId={testId}
          plugins={[plugin]}
          entityKey={'entity-key'}
          active={props?.active ?? true}
          onCreate={onCreateMock}
          onFailure={onFailureMock}
          onCancel={onCloseMock}
        />
      </IntlProvider>,
    );
  };

  it("should find LinkCreate by its testid when it's active", async () => {
    const { getByTestId } = setUpLinkCreate();
    expect(getByTestId(testId)).toBeTruthy();
  });

  it("should NOT find LinkCreate by its testid when it's NOT active", async () => {
    const { queryByTestId } = setUpLinkCreate({ active: false });
    expect(queryByTestId(testId)).toBeNull();
  });

  it('should trigger the callback onCreate when it submits the form', async () => {
    const { getByTestId } = setUpLinkCreate();
    await getByTestId('submit-button').click();
    expect(onCreateMock).toBeCalledWith(
      expect.objectContaining({
        url: 'https://www.atlassian.com',
        objectId: '123',
        objectType: 'page',
        data: { spaceName: 'space' },
      }),
    );
  });

  it('should trigger the callback onFailure when the form fails', async () => {
    const { getByTestId } = setUpLinkCreate();
    getByTestId('error-button').click();
    expect(onFailureMock).toBeCalled();
  });

  it('should trigger the callback onCancel when it close the form', async () => {
    const { getByTestId } = setUpLinkCreate();
    getByTestId('close-button').click();
    expect(onCloseMock).toBeCalled();
  });

  it('should display a custom title when provided', async () => {
    const { queryByTestId, getByText } = setUpLinkCreate({
      modalTitle: 'Create meeting notes',
    });
    expect(queryByTestId(testId)).toBeInTheDocument();
    expect(getByText('Create meeting notes')).toBeTruthy();
  });

  it('should trigger the Modal Callbacks when provided', async () => {
    let onOpenComplete = jest.fn();
    let onCloseComplete = jest.fn();
    const { getByTestId, queryByTestId } = setUpLinkCreate({
      onOpenComplete,
      onCloseComplete,
    });

    waitFor(() => {
      expect(queryByTestId(testId)).toBeInTheDocument();
      expect(onOpenComplete).toHaveBeenCalledTimes(1);
    });

    getByTestId('close-button').click();

    waitFor(() => {
      expect(queryByTestId(testId)).not.toBeInTheDocument();
      expect(onCloseComplete).toHaveBeenCalledTimes(1);
    });
  });
});
