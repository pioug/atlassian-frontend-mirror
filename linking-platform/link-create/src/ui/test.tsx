import React, { useCallback } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import { LinkCreatePlugin, LinkCreateWithModalProps } from '../common/types';
import { useLinkCreateCallback } from '../controllers/callback-context';

import LinkCreate, { CreateForm } from './index';

jest.mock('@atlaskit/linking-common/sentry', () => ({
  captureException: jest.fn(),
}));

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
  let onCompleteMock: jest.Mock;
  let onFailureMock: jest.Mock;
  let onCancelMock: jest.Mock;
  let onCloseCompleteMock: jest.Mock;
  let onAnalyticsEventMock: jest.Mock;

  const testId = 'link-create';
  const dismissDialogTestId = 'link-create-confirm-dismiss-dialog';

  beforeEach(() => {
    onCreateMock = jest.fn();
    onCompleteMock = jest.fn();
    onFailureMock = jest.fn();
    onCancelMock = jest.fn();
    onCloseCompleteMock = jest.fn();
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
    const Component = (props?: Partial<LinkCreateWithModalProps>) => {
      return (
        <IntlProvider locale="en">
          <AnalyticsListener channel={'media'} onEvent={onAnalyticsEventMock}>
            <LinkCreate
              testId={testId}
              plugins={plugins}
              entityKey="entity-key"
              active={true}
              onFailure={onFailureMock}
              onCreate={onCreateMock}
              onCancel={onCancelMock}
              onCloseComplete={onCloseCompleteMock}
              {...props}
            />
          </AnalyticsListener>
        </IntlProvider>
      );
    };

    const renderResult = render(<Component {...props} />);

    const rerender = (props?: Partial<LinkCreateWithModalProps>) =>
      renderResult.rerender(<Component {...props} />);

    return {
      rerender,
    };
  };

  it("should find LinkCreate by its testid when it's active", async () => {
    setUpLinkCreate();

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should hide LinkCreate when `active` changes from `true` to `false`', async () => {
    const { rerender } = setUpLinkCreate({
      active: true,
    });

    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(onCloseCompleteMock).toBeCalledTimes(0);

    rerender({ active: false });

    // Expect it is still visible temporarily while transitioning out
    expect(screen.getByTestId(testId)).toBeInTheDocument();

    // Exits
    await waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    });
    expect(onCloseCompleteMock).toBeCalledTimes(1);
  });

  it('should fire screen viewed analytics event when it opens', async () => {
    setUpLinkCreate();

    expect(screen.getByTestId(testId)).toBeInTheDocument();

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
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  it('should only trigger the callback onCreate when it submits the form when onComplete is not provided', async () => {
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
    // the onCreate callback is awaited
    await flushPromises();
    expect(onCompleteMock).toBeCalledTimes(0);
  });

  it('should trigger the callback onCreate and onComplete when it submits the form if onComplete is provided', async () => {
    setUpLinkCreate({ onComplete: onCompleteMock });
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
    // the onCreate callback is awaited before onComplete is called
    await flushPromises();
    expect(onCompleteMock).toBeCalledTimes(1);
  });

  it('should trigger the callback onFailure when the form fails', async () => {
    setUpLinkCreate();
    screen.getByTestId('error-button').click();
    expect(onFailureMock).toBeCalled();
  });

  it('should trigger the callback onCancel when it close the form', async () => {
    setUpLinkCreate();
    screen.getByTestId('close-button').click();
    expect(onCancelMock).toBeCalled();
  });

  describe('link create modal should trigger onComplete if it is provided', () => {
    ffTest(
      'platform.linking-platform.link-create.enable-edit',
      async () => {
        setUpLinkCreate({ onComplete: onCompleteMock });
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
        // the onCreate callback is awaited before onComplete is called
        await flushPromises();
        expect(onCompleteMock).toBeCalledTimes(1);
      },
      async () => {
        setUpLinkCreate({ onComplete: onCompleteMock });
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
        // the onCreate callback is awaited before onComplete is called
        await flushPromises();
        expect(onCompleteMock).toBeCalledTimes(1);
      },
    );
  });

  describe('error boundary', () => {
    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should display an error boundary on unhandled error within the link create modal', async () => {
      setUpLinkCreate({
        entityKey: 'undefined' as any,
      });
      expect(
        await screen.findByTestId('link-create-error-boundary-ui'),
      ).toBeInTheDocument();
    });

    describe('should display outer error boundary on unhandled error outside the link create modal', () => {
      // should capture exception to sentry when error boundary is hit
      ffTest(
        'platform.linking-platform.link-create.enable-sentry-client',
        async () => {
          // when `enable-edit` flag is enabled, there's an additional <LinkCreatePluginsProvider />
          // which will throw error outside of link create modal if `plugins` contains bad data
          setUpLinkCreate({ plugins: 'error' as any });

          expect(captureException).toHaveBeenCalledWith(
            expect.any(Error),
            'link-create',
          );
          expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
            payload: {
              action: 'unhandledErrorCaught',
              actionSubject: 'linkCreate',
              attributes: {
                error: 'TypeError',
                componentStack: 'unknown',
              },
            },
          });
        },
        async () => {
          setUpLinkCreate({ plugins: 'error' as any });

          expect(captureException).not.toHaveBeenCalled();
          expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
            payload: {
              action: 'unhandledErrorCaught',
              actionSubject: 'linkCreate',
              attributes: {
                error: 'TypeError: plugins.find is not a function',
              },
            },
          });
        },
      );

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
        const { rerender } = setUpLinkCreate({ active: true });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');

        rerender({
          active: false,
        });

        await waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(onCancelMock).toHaveBeenCalled();
        });
      },
      async () => {
        const { rerender } = setUpLinkCreate({ active: true });

        expect(await screen.findByTestId(testId)).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');

        rerender({
          active: false,
        });

        await waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(onCancelMock).toHaveBeenCalled();
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

        await waitFor(() => {
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

        await waitFor(() => {
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
        const { rerender } = setUpLinkCreate({
          active: true,
          entityKey: 'plugin-with-create-form',
        });

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

        rerender({
          active: false,
        });

        await waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
          expect(onCancelMock).toHaveBeenCalled();
        });
      },
      async () => {
        const { rerender } = setUpLinkCreate({
          active: true,
          entityKey: 'plugin-with-create-form',
        });

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

        rerender({
          active: false,
        });

        await waitFor(() => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
          expect(
            screen.queryByTestId(dismissDialogTestId),
          ).not.toBeInTheDocument();
          expect(onCancelMock).toHaveBeenCalled();
        });
      },
    );
  });

  it('should trigger the Modal Callbacks when provided', async () => {
    let onOpenComplete = jest.fn();
    let onCloseComplete = jest.fn();

    const { rerender } = setUpLinkCreate({
      active: true,
      onOpenComplete,
      onCloseComplete,
    });

    expect(await screen.findByTestId(testId)).toBeInTheDocument();

    await waitFor(() => {
      expect(onOpenComplete).toHaveBeenCalledTimes(1);
    });

    rerender({
      active: false,
      onOpenComplete,
      onCloseComplete,
    });

    await waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      expect(onCloseComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('plugin edit view', () => {
    const onSubmitSpy = jest.fn();

    function Form() {
      const { onCreate, onCancel } = useLinkCreateCallback();

      const onSubmit = useCallback(async () => {
        try {
          onSubmitSpy();
          await onCreate?.({
            url: 'https://atlassian.com',
            objectId: 'someId',
            objectType: 'someObjectType',
            ari: 'example-ari',
          });
        } catch (err) {
          // don't complete
        }
      }, [onCreate]);

      return (
        <CreateForm onSubmit={onSubmit} onCancel={onCancel}>
          Form
        </CreateForm>
      );
    }

    const pluginWithEdit: LinkCreatePlugin = {
      group: {
        label: 'group-label',
        icon: 'group-icon',
        key: 'group',
      },
      label: 'entity-label',
      icon: 'entity-icon',
      key: 'entity-key',
      form: <Form />,
      editView: jest.fn(({ onClose }) => (
        <button onClick={onClose}>Finish</button>
      )),
    };

    describe('should NOT show edit button when edit view is undefined even if `onComplete` is provided', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          setUpLinkCreate({
            plugins: [{ ...pluginWithEdit, editView: undefined }],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();
        },
        async () => {
          setUpLinkCreate({
            plugins: [{ ...pluginWithEdit, editView: undefined }],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();
        },
      );
    });

    describe('with create form should show edit button when edit view and `onComplete` is provided', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            await screen.findByRole('button', { name: 'Edit' }),
          ).toBeInTheDocument();
        },
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();
        },
      );
    });

    describe('onCloseComplete should only be called when active changes from `true` to `false`', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          const { rerender } = setUpLinkCreate({
            active: true,
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });
          expect(onCloseCompleteMock).not.toHaveBeenCalled();

          rerender({ active: false });

          // Expect it is still visible temporarily while transitioning out
          expect(screen.getByTestId('link-create-modal')).toBeInTheDocument();

          // Exits
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-modal'),
            ).not.toBeInTheDocument();
          });
          expect(onCloseCompleteMock).toHaveBeenCalled();
        },
        async () => {
          const { rerender } = setUpLinkCreate({
            active: true,
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });
          expect(onCloseCompleteMock).not.toHaveBeenCalled();

          rerender({ active: false });

          // Expect it is still visible temporarily while transitioning out
          expect(screen.getByTestId('link-create-modal')).toBeInTheDocument();

          // Exits
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-modal'),
            ).not.toBeInTheDocument();
          });
          expect(onCloseCompleteMock).toHaveBeenCalled();
        },
      );
    });

    describe('with create form + edit view should render editView when edit button is clicked', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          const { rerender } = setUpLinkCreate({
            active: true,
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          const editButton = await screen.findByRole('button', {
            name: 'Edit',
          });

          await userEvent.click(editButton);

          // Because modals transition in and out they will still
          // be in the DOM temporarily when exiting
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-modal'),
            ).not.toBeInTheDocument();
            expect(
              screen.queryByTestId('link-create-edit-modal'),
            ).toBeInTheDocument();
          });
          expect(onCloseCompleteMock).not.toHaveBeenCalled();

          expect(onSubmitSpy).toBeCalled();
          expect(onCreateMock).toBeCalledWith(
            expect.objectContaining({
              url: 'https://atlassian.com',
              objectId: 'someId',
              objectType: 'someObjectType',
            }),
          );

          // the onCreate callback is awaited before onComplete is called
          await flushPromises();
          expect(onCompleteMock).toBeCalledTimes(0);

          const editCloseButton = await screen.findByRole('button', {
            name: 'Finish',
          });
          await userEvent.click(editCloseButton);
          rerender({
            active: false,
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          expect(
            screen.queryByTestId('link-create-edit-modal'),
          ).toBeInTheDocument();
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-edit-modal'),
            ).not.toBeInTheDocument();
          });
          expect(onCloseCompleteMock).toBeCalledTimes(1);
        },
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();
        },
      );
    });

    describe('with create form + edit view should NOT render editView when create button is clicked', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          const createButton = await screen.findByRole('button', {
            name: 'Create',
          });

          await userEvent.click(createButton);

          // Because modals transition in and out they will still
          // be in the DOM temporarily when exiting
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-modal'),
            ).toBeInTheDocument();
            expect(
              screen.queryByTestId('link-create-edit-modal'),
            ).not.toBeInTheDocument();
          });

          expect(onSubmitSpy).toBeCalled();
          expect(onCreateMock).toBeCalledWith(
            expect.objectContaining({
              url: 'https://atlassian.com',
              objectId: 'someId',
              objectType: 'someObjectType',
            }),
          );
          // the onCreate callback is awaited before onComplete is called
          await flushPromises();
          expect(onCompleteMock).toBeCalled();
        },
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          const createButton = await screen.findByRole('button', {
            name: 'Create',
          });
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();

          await userEvent.click(createButton);

          // Because modals transition in and out they will still
          // be in the DOM temporarily when exiting
          await waitFor(() => {
            expect(
              screen.queryByTestId('link-create-modal'),
            ).toBeInTheDocument();
            expect(
              screen.queryByTestId('link-create-edit-modal'),
            ).not.toBeInTheDocument();
          });

          expect(onSubmitSpy).toBeCalled();
          expect(onCreateMock).toBeCalledWith(
            expect.objectContaining({
              url: 'https://atlassian.com',
              objectId: 'someId',
              objectType: 'someObjectType',
            }),
          );
          // the onCreate callback is awaited before onComplete is called
          await flushPromises();
          expect(onCompleteMock).toBeCalled();
        },
      );
    });

    describe('with create form + edit view should NOT render editView when close button is clicked', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          const closeButton = await screen.findByRole('button', {
            name: 'Close',
          });

          await userEvent.click(closeButton);

          expect(onCreateMock).toBeCalledTimes(0);
          expect(onCompleteMock).toBeCalledTimes(0);
          expect(onCancelMock).toBeCalledTimes(1);
          expect(
            screen.queryByTestId('link-create-edit-modal'),
          ).not.toBeInTheDocument();
        },
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          const closeButton = await screen.findByRole('button', {
            name: 'Close',
          });

          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();

          await userEvent.click(closeButton);

          expect(onCreateMock).toBeCalledTimes(0);
          expect(onCompleteMock).toBeCalledTimes(0);
          expect(onCancelMock).toBeCalledTimes(1);
          expect(
            screen.queryByTestId('link-create-edit-modal'),
          ).not.toBeInTheDocument();
        },
      );
    });

    describe('should NOT trigger the edit flow if the form fails to submit', () => {
      ffTest(
        'platform.linking-platform.link-create.enable-edit',
        async () => {
          onSubmitSpy.mockImplementation(() => {
            throw new Error('Something went wrong!');
          });

          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          await waitFor(async () => {
            userEvent.click(
              await screen.findByRole('button', {
                name: 'Edit',
              }),
            );
          });

          // Enters submitting state
          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: 'Edit' }),
            ).toHaveAttribute('aria-busy', 'true');
          });

          // Exits sumitting state
          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: 'Edit' }),
            ).toHaveAttribute('aria-busy', 'false');
            expect(onSubmitSpy).toBeCalled();
          });

          // Edit modal not visible
          // Create modal still visible
          expect(
            screen.queryByTestId('link-create-edit-modal'),
          ).not.toBeInTheDocument();
          expect(screen.queryByTestId('link-create-modal')).toBeInTheDocument();
          expect(onCreateMock).not.toBeCalled();

          onSubmitSpy.mockReset();
        },
        async () => {
          setUpLinkCreate({
            plugins: [pluginWithEdit],
            onComplete: onCompleteMock,
          });

          expect(
            await screen.findByRole('button', { name: 'Create' }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: 'Edit' }),
          ).not.toBeInTheDocument();
        },
      );
    });
  });
});
