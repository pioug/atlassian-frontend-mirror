import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';

import { LinkCreatePlugin, LinkCreateProps } from '../common/types';
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
        onClick={() => onFailure && onFailure('An error just happened')}
      >
        Trigger an error
      </Button>
      <Button testId="cancel-button" appearance="primary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

describe('<LinkCreate />', () => {
  let onCreateMock: jest.Mock;
  let onFailureMock: jest.Mock;
  let onCancelMock: jest.Mock;

  const testId = 'link-create';

  beforeEach(() => {
    onCreateMock = jest.fn();
    onFailureMock = jest.fn();
    onCancelMock = jest.fn();
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

  const setUpLinkCreate = (props?: Partial<LinkCreateProps>) => {
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
          onCancel={onCancelMock}
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
    expect(onCreateMock).toBeCalledWith('https://www.atlassian.com');
  });

  it('should trigger the callback onFailure when the form fails', async () => {
    const { getByTestId } = setUpLinkCreate();
    getByTestId('error-button').click();
    expect(onFailureMock).toBeCalled();
  });

  it('should trigger the callback onCancel when it cancels the form', async () => {
    const { getByTestId } = setUpLinkCreate();
    getByTestId('cancel-button').click();
    expect(onCancelMock).toBeCalled();
  });
});
