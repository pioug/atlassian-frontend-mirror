import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
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
            ari: 'example-ari',
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
  let onAnalyticsEventMock: jest.Mock;

  const testId = 'link-create';
  const dismissDialogTestId = 'link-create-confirm-dismiss-dialog';

  beforeEach(() => {
    onCreateMock = jest.fn();
    onFailureMock = jest.fn();
    onCloseMock = jest.fn();
    onAnalyticsEventMock = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const plugins: LinkCreatePlugin[] = [
    {
      group: {
        label: 'group-label',
        icon: 'group-icon',
        key: 'group',
      },
      label: 'entity-label',
      icon: 'entity-icon',
      key: 'entity-key',
      form: <CreatePluginForm />,
    },
    {
      group: {
        label: 'group-label',
        icon: 'group-icon',
        key: 'group',
      },
      label: 'plugin-with-create-form',
      icon: 'plugin-with-create-form',
      key: 'plugin-with-create-form',
      form: <MockPluginForm />,
    },
  ];

  const setUpLinkCreate = (props?: Partial<LinkCreateWithModalProps>) => {
    render(
      <IntlProvider locale="en">
        <AnalyticsListener channel={'media'} onEvent={onAnalyticsEventMock}>
          <LinkCreate
            testId={testId}
            plugins={plugins}
            entityKey="entity-key"
            active={true}
            onCreate={onCreateMock}
            onFailure={onFailureMock}
            onCancel={onCloseMock}
            {...props}
          />
        </AnalyticsListener>
      </IntlProvider>,
    );
  };

  it("should find LinkCreate by its testid when it's active", async () => {
    setUpLinkCreate();
    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  it('should fire screen viewed analytics event when it opens', async () => {
    setUpLinkCreate();

    expect(screen.getByTestId(testId)).toBeTruthy();

    expect(onAnalyticsEventMock).toBeCalled();
    const mockCall = onAnalyticsEventMock.mock.calls[0];
    expect(mockCall[0]).toMatchObject({
      payload: {
        eventType: 'screen',
        name: 'linkCreateScreen',
        action: 'viewed',
        // Attributes from AnalyticsContext will not yet show up here
        attributes: expect.any(Object),
      },
    });
  });

  it("should NOT find LinkCreate by its testid when it's NOT active", async () => {
    setUpLinkCreate({ active: false });
    expect(screen.queryByTestId(testId)).toBeNull();
  });

  it('should trigger the callback onCreate when it submits the form', async () => {
    setUpLinkCreate();
    screen.getByTestId('submit-button').click();

    expect(onCreateMock).toBeCalledWith(
      expect.objectContaining({
        url: 'https://www.atlassian.com',
        objectId: '123',
        objectType: 'page',
        data: { spaceName: 'space' },
        ari: 'example-ari',
      }),
    );
  });

  it('should trigger the callback onFailure when the form fails', async () => {
    setUpLinkCreate();
    screen.getByTestId('error-button').click();
    expect(onFailureMock).toBeCalled();
  });

  it('should trigger the callback onCancel when it close the form', async () => {
    setUpLinkCreate();
    screen.getByTestId('close-button').click();
    expect(onCloseMock).toBeCalled();
  });

  describe('error boundary', () => {
    it('should display an error boundary on unhandled error within the link create modal', async () => {
      setUpLinkCreate({
        entityKey: 'undefined' as any,
      });

      expect(
        await screen.findByTestId('link-create-error-boundary-ui'),
      ).toBeInTheDocument();
    });

    describe('should display outer error boundary on unhandled error outside the link create modal', () => {
      ffTest(
        'platform.linking-platform.link-create.outer-error-boundary',
        ff =>
          ffTest(
            'platform.linking-platform.link-create.enable-edit',
            async () => {
              // when `enable-edit` flag is enabled, there's an additional <LinkCreatePluginsProvider />
              // which will throw error outside of link create modal if `plugins` contains bad data
              setUpLinkCreate({ plugins: 'error' as any });

              expect(
                await screen.findByTestId('link-create-error-boundary-modal'),
              ).toBeInTheDocument();
            },
            async () => {
              setUpLinkCreate({ plugins: 'error' as any });

              expect(
                await screen.findByTestId('link-create-error-boundary-ui'),
              ).toBeInTheDocument();
              expect(
                screen.queryByTestId('link-create-error-boundary-modal'),
              ).not.toBeInTheDocument();
            },
            ff,
          ),
        async () => {
          setUpLinkCreate({ plugins: 'error' as any });

          expect(
            await screen.findByTestId('link-create-error-boundary-ui'),
          ).toBeInTheDocument();
          expect(
            screen.queryByTestId('link-create-error-boundary-modal'),
          ).not.toBeInTheDocument();
        },
      );
    });
  });

  it('should display a custom title when provided', async () => {
    setUpLinkCreate({
      modalTitle: 'Create meeting notes',
    });
    expect(screen.queryByTestId(testId)).toBeInTheDocument();
    expect(screen.getByText('Create meeting notes')).toBeTruthy();
  });

  describe('should close modal on Esc if no changes are made', () => {
    ffTest(
      'platform.linking-platform.link-create.confirm-dismiss-dialog',
      async () => {
        setUpLinkCreate();

        expect(await screen.findByTestId(testId)).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');

        waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
        });
      },
      async () => {
        setUpLinkCreate();

        expect(await screen.findByTestId(testId)).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');

        waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
        });
      },
    );
  });

  describe('should display Confirm Dismiss Dialog when changes are made and user clicks close or Esc', () => {
    ffTest(
      'platform.linking-platform.link-create.confirm-dismiss-dialog',
      async () => {
        setUpLinkCreate({ entityKey: 'plugin-with-create-form' });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();

        const textField = screen.getByLabelText(
          /Enter some Text/i,
        ) as HTMLInputElement;

        expect(textField).toBeTruthy();
        await userEvent.click(textField);
        await userEvent.keyboard('title text content');

        await userEvent.click(
          screen.getByTestId('link-create-form-button-cancel'),
        );

        expect(
          await screen.findByTestId(dismissDialogTestId),
        ).toBeInTheDocument();

        const goBackBtn = screen.getByText(/Go back/i) as HTMLInputElement;
        expect(goBackBtn).toBeTruthy();
        await userEvent.click(goBackBtn);

        waitFor(() => {
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
        });

        await userEvent.keyboard('{Escape}');

        expect(
          await screen.findByTestId(dismissDialogTestId),
        ).toBeInTheDocument();
      },
      async () => {
        setUpLinkCreate({ entityKey: 'plugin-with-create-form' });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();

        const textField = screen.getByLabelText(
          /Enter some Text/i,
        ) as HTMLInputElement;

        expect(textField).toBeTruthy();
        await userEvent.click(textField);
        await userEvent.keyboard('title text content');

        await userEvent.click(
          screen.getByTestId('link-create-form-button-cancel'),
        );

        waitFor(() => {
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
        });
      },
    );
  });

  describe('should dismiss create on confirm Dismiss Dialog', () => {
    ffTest(
      'platform.linking-platform.link-create.confirm-dismiss-dialog',
      async () => {
        setUpLinkCreate({ entityKey: 'plugin-with-create-form' });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();

        const textField = screen.getByLabelText(
          /Enter some Text/i,
        ) as HTMLInputElement;

        expect(textField).toBeTruthy();
        await userEvent.click(textField);
        await userEvent.keyboard('title text content');

        await userEvent.click(
          screen.getByTestId('link-create-form-button-cancel'),
        );

        expect(
          await screen.findByTestId(dismissDialogTestId),
        ).toBeInTheDocument();

        const discardBtn = screen.getByText(/Discard/i) as HTMLInputElement;
        expect(discardBtn).toBeTruthy();
        await userEvent.click(discardBtn);

        waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
        });
      },
      async () => {
        setUpLinkCreate({ entityKey: 'plugin-with-create-form' });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();

        const textField = screen.getByLabelText(
          /Enter some Text/i,
        ) as HTMLInputElement;

        expect(textField).toBeTruthy();
        await userEvent.click(textField);
        await userEvent.keyboard('title text content');

        await userEvent.click(
          screen.getByTestId('link-create-form-button-cancel'),
        );

        waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
        });
      },
    );
  });

  it('should trigger the Modal Callbacks when provided', async () => {
    let onOpenComplete = jest.fn();
    let onCloseComplete = jest.fn();

    setUpLinkCreate({
      onOpenComplete,
      onCloseComplete,
    });

    expect(await screen.findByTestId(testId)).toBeInTheDocument();

    waitFor(() => {
      expect(onOpenComplete).toHaveBeenCalledTimes(1);
    });

    screen.getByTestId('close-button').click();

    waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      expect(onCloseComplete).toHaveBeenCalledTimes(1);
    });
  });
});
