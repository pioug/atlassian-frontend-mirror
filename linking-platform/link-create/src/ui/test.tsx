import React from 'react';

import { render } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';

import { useLinkCreateCallback } from '../controllers/callback-context';

import { LinkCreatePlugin } from './types';

import LinkCreate from './index';

describe('LinkCreate', () => {
  const testId = 'link-create';

  const ConfluenceCreationForm = () => {
    const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

    return (
      <div>
        This is a form. Trust me.
        <Button
          testId="submit-button"
          appearance="primary"
          onClick={() => onCreate && onCreate('https://www.atlassian.com')}
        >
          Success
        </Button>
        <Button testId="error-button" appearance="primary" onClick={onFailure}>
          Trigger an error
        </Button>
        <Button testId="cancel-button" appearance="primary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  };

  const plugin: LinkCreatePlugin = {
    group: {
      label: 'group-label',
      icon: 'group-icon',
      key: 'group',
    },
    label: 'entity-label',
    icon: 'entity-icon',
    key: 'entity-key',
    form: <ConfluenceCreationForm />,
  };

  it("should find LinkCreate by its testid when it's active", async () => {
    const { getByTestId } = render(
      <LinkCreate
        testId={testId}
        plugins={[plugin]}
        entityKey="entity-key"
        active={true}
      />,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });

  it("should NOT find LinkCreate by its testid when it's active", async () => {
    const { queryByTestId } = render(
      <LinkCreate testId={testId} plugins={[plugin]} entityKey="entity-key" />,
    );

    expect(queryByTestId(testId)).toBeNull();
  });

  it('should trigger the callback onCreate when it submits the form', async () => {
    const onCreate = jest.fn();

    const { getByTestId } = render(
      <LinkCreate
        testId={testId}
        plugins={[plugin]}
        entityKey="entity-key"
        active={true}
        onCreate={onCreate}
      />,
    );

    getByTestId('submit-button').click();
    expect(onCreate).toBeCalledWith('https://www.atlassian.com');
  });

  it('should trigger the callback onFailure when the form fails', async () => {
    const onFailure = jest.fn();

    const { getByTestId } = render(
      <LinkCreate
        testId={testId}
        plugins={[plugin]}
        entityKey="entity-key"
        active={true}
        onFailure={onFailure}
      />,
    );

    getByTestId('error-button').click();
    expect(onFailure).toBeCalled();
  });

  it('should trigger the callback onCancel when it cancels the form', async () => {
    const onCancel = jest.fn();

    const { getByTestId } = render(
      <LinkCreate
        testId={testId}
        plugins={[plugin]}
        entityKey="entity-key"
        active={true}
        onCancel={onCancel}
      />,
    );

    getByTestId('cancel-button').click();
    expect(onCancel).toBeCalled();
  });
});
