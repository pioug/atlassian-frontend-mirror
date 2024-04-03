import React, { useCallback } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';
import {
  ffTest,
  getCurrentFeatureFlag,
} from '@atlassian/feature-flags-test-utils';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import { LinkCreatePlugin, LinkCreateWithModalProps } from '../common/types';
import { useLinkCreateCallback } from '../controllers/callback-context';

import LinkCreate, { CreateForm } from './index';

jest.mock('@atlaskit/linking-common/sentry', () => ({
  captureException: jest.fn(),
}));

const editButtonLabel = 'Create + Open';

describe('<LinkCreate />', () => {
  let onCreateMock: jest.Mock;
  let onCompleteMock: jest.Mock;
  let onFailureMock: jest.Mock;
  let onCancelMock: jest.Mock;
  let onCloseCompleteMock: jest.Mock;
  let onAnalyticsEventMock: jest.Mock;
  let createError: Error | undefined;

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
    createError = undefined;
  });

  const CreatePluginForm: React.ComponentType = jest.fn(() => {
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
          onClick={() =>
            onFailure &&
            onFailure(createError ?? Error('An error just happened'))
          }
        >
          Trigger an error
        </Button>
        <Button testId="close-button" appearance="primary" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
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

    const unmount = () => renderResult.unmount();

    return {
      rerender,
      unmount,
    };
  };

  it("should find LinkCreate by its testid when it's active", async () => {
    setUpLinkCreate();

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should fire modal dialog analytics on mount and unmount', async () => {
    const { unmount } = setUpLinkCreate();

    expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
      payload: {
        eventType: 'ui',
        actionSubject: 'modalDialog',
        actionSubjectId: 'linkCreate',
        action: 'opened',
      },
    });

    unmount();

    expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
      payload: {
        eventType: 'ui',
        actionSubject: 'modalDialog',
        actionSubjectId: 'linkCreate',
        action: 'closed',
      },
    });
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

  describe('it should not consider all errors to fail our SLO (eg. ignore failed to fetch) when `onFailure` is called', () => {
    beforeEach(() => {
      createError = new TypeError('Failed to fetch');
    });

    ffTest(
      'platform.linking-platform.link-create.better-observability',
      async () => {
        setUpLinkCreate();

        screen.getByTestId('error-button').click();
        expect(onFailureMock).toBeCalledTimes(1);

        expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
          payload: {
            eventType: 'operational',
            action: 'failed',
            actionSubject: 'linkCreateExperience',
            attributes: {
              errorType: 'TypeError',
              isSLOFailure: false,
            },
          },
        });
      },
      async () => {
        setUpLinkCreate();

        screen.getByTestId('error-button').click();
        expect(onFailureMock).toBeCalledTimes(1);

        expect(onAnalyticsEventMock).not.toBeFiredWithAnalyticEventOnce({
          payload: {
            eventType: 'operational',
            action: 'failed',
            actionSubject: 'linkCreateExperience',
          },
        });
      },
    );
  });

  describe('it should dispatch operational analytics when a plugin calls `onFailure` and can still proceed to succeed the experience', () => {
    ffTest(
      'platform.linking-platform.link-create.better-observability',
      ff =>
        // eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
        ffTest(
          'platform.linking-platform.link-create.enable-sentry-client',
          ff => {
            ffTest(
              'platform.linking-platform.link-create.tmp-log-error-message',
              async () => {
                setUpLinkCreate();

                screen.getByTestId('error-button').click();
                expect(onFailureMock).toBeCalledTimes(1);

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'Error',
                      errorMessage: 'An error just happened',
                      path: null,
                      status: null,
                      traceId: null,
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'STARTED',
                    },
                  },
                });

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

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'track',
                    action: 'created',
                    actionSubject: 'object',
                    actionSubjectId: 'linkCreate',
                  },
                });

                /**
                 * Could technically still fail the experience again after creation if we want to
                 */
                screen.getByTestId('error-button').click();
                expect(onFailureMock).toBeCalledTimes(2);

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'Error',
                      path: null,
                      status: null,
                      traceId: null,
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'SUCCEEDED',
                    },
                  },
                });

                // the onCreate callback is awaited
                await flushPromises();
              },
              async () => {
                setUpLinkCreate();

                screen.getByTestId('error-button').click();
                expect(onFailureMock).toBeCalledTimes(1);

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'Error',
                      errorMessage: null,
                      path: null,
                      status: null,
                      traceId: null,
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'STARTED',
                    },
                  },
                });
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

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'track',
                    action: 'created',
                    actionSubject: 'object',
                    actionSubjectId: 'linkCreate',
                  },
                });

                /**
                 * Could technically still fail the experience again after creation if we want to
                 */
                screen.getByTestId('error-button').click();
                expect(onFailureMock).toBeCalledTimes(2);

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'Error',
                      path: null,
                      status: null,
                      traceId: null,
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'SUCCEEDED',
                    },
                  },
                });

                // the onCreate callback is awaited
                await flushPromises();
              },
              ff,
            );
          },
          undefined,
          ff,
        ),
      async () => {
        setUpLinkCreate();

        screen.getByTestId('error-button').click();
        expect(onFailureMock).toBeCalledTimes(1);

        expect(captureException).not.toHaveBeenCalled();
        expect(onAnalyticsEventMock).not.toBeFiredWithAnalyticEventOnce({
          payload: {
            eventType: 'operational',
            action: 'failed',
            actionSubject: 'linkCreateExperience',
          },
        });
      },
    );
  });

  it('should trigger the callback onCancel when it close the form', async () => {
    setUpLinkCreate();
    screen.getByTestId('close-button').click();
    expect(onCancelMock).toBeCalled();
  });

  it('link create modal should trigger onComplete if it is provided', async () => {
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

    describe('errors are correctly captured by error boundary', () => {
      describe('when triggered by link create', () => {
        ffTest(
          'platform.linking-platform.link-create.better-observability',
          ff =>
            ffTest(
              'platform.linking-platform.link-create.enable-sentry-client',
              async () => {
                setUpLinkCreate({
                  entityKey: 'undefined' as any,
                });

                expect(
                  await screen.findByTestId('link-create-error-boundary-ui'),
                ).toBeInTheDocument();

                if (getCurrentFeatureFlag()![1]) {
                  expect(captureException).toHaveBeenCalledTimes(1);
                  expect(captureException).toHaveBeenCalledWith(
                    expect.any(Error),
                    'link-create',
                  );
                } else {
                  expect(captureException).not.toHaveBeenCalled();
                }

                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'Error',
                      path: null,
                      status: null,
                      traceId: null,
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'STARTED',
                    },
                  },
                });
              },
              async () => {
                setUpLinkCreate({
                  entityKey: 'undefined' as any,
                });
              },
              ff,
            ),
          async () => {
            setUpLinkCreate({
              entityKey: 'undefined' as any,
            });

            expect(
              await screen.findByTestId('link-create-error-boundary-ui'),
            ).toBeInTheDocument();
            expect(captureException).not.toHaveBeenCalled();
            expect(onAnalyticsEventMock).not.toBeFiredWithAnalyticEventOnce({
              payload: {
                eventType: 'operational',
                action: 'failed',
                actionSubject: 'linkCreateExperience',
              },
            });
          },
        );
      });

      describe('when response thrown by a plugin render, captured by error boundary, sends analytics but not captured to sentry', () => {
        beforeEach(() => {
          asMock(CreatePluginForm).mockImplementationOnce(() => {
            const response = new Response(null, {
              status: 500,
              headers: { 'x-trace-id': 'some-traceid' },
            });
            Object.defineProperty(response, 'url', {
              value: 'https://atlassian.com/gateway/api',
            });
            throw response;
          });
        });

        ffTest(
          'platform.linking-platform.link-create.better-observability',
          ff =>
            // eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
            ffTest(
              'platform.linking-platform.link-create.enable-sentry-client',
              async () => {
                setUpLinkCreate();

                expect(
                  await screen.findByTestId('link-create-error-boundary-ui'),
                ).toBeInTheDocument();

                /**
                 * Should never send response to sentry
                 */
                expect(captureException).not.toHaveBeenCalled();
                expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
                  payload: {
                    eventType: 'operational',
                    action: 'failed',
                    actionSubject: 'linkCreateExperience',
                    attributes: {
                      errorType: 'NetworkError',
                      path: '/gateway/api',
                      status: 500,
                      traceId: 'some-traceid',
                      experienceStatus: 'FAILED',
                      previousExperienceStatus: 'STARTED',
                    },
                  },
                });
              },
              undefined,
              ff,
            ),
          async () => {
            setUpLinkCreate();

            expect(
              await screen.findByTestId('link-create-error-boundary-ui'),
            ).toBeInTheDocument();
            expect(captureException).not.toHaveBeenCalled();
            expect(onAnalyticsEventMock).not.toBeFiredWithAnalyticEventOnce({
              payload: {
                eventType: 'operational',
                action: 'failed',
                actionSubject: 'linkCreateExperience',
              },
            });
          },
        );
      });
    });

    describe('should display outer error boundary on unhandled error outside the link create modal', () => {
      // should capture exception to sentry when error boundary is hit
      ffTest(
        'platform.linking-platform.link-create.enable-sentry-client',
        async () => {
          setUpLinkCreate({ plugins: 'error' as any });

          expect(captureException).toHaveBeenCalledWith(
            expect.any(TypeError),
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
          expect(
            await screen.findByTestId('link-create-error-boundary-modal'),
          ).toBeInTheDocument();
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
          expect(
            await screen.findByTestId('link-create-error-boundary-modal'),
          ).toBeInTheDocument();
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

  it('should display a custom hero when provided', async () => {
    //  eslint-disable-next-line jsx-a11y/img-redundant-alt
    const HeroModal = () => <img src="some image here" alt="some image here" />;
    setUpLinkCreate({
      modalHero: <HeroModal />,
    });

    const heroModal = screen.queryByTestId('link-create-modal-hero');
    expect(heroModal).toBeInTheDocument();
  });

  it('should close modal on Esc if no changes are made', async () => {
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
  });

  it('should display Confirm Dismiss Dialog when changes are made and user clicks close or Esc', async () => {
    setUpLinkCreate({ entityKey: 'plugin-with-create-form' });

    expect(await screen.findByTestId(testId)).toBeInTheDocument();

    const textField = screen.getByLabelText(
      /Enter some Text/i,
    ) as HTMLInputElement;

    // User makes changes to the form
    expect(textField).toBeTruthy();
    await userEvent.click(textField);
    await userEvent.keyboard('title text content');

    // user clicks 'cancel'
    await userEvent.click(screen.getByTestId('link-create-form-button-cancel'));

    // Should not cancel and display confirm dismiss dialog instead
    expect(onCancelMock).not.toHaveBeenCalled();
    expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

    // User dismiss the dialog
    const goBackBtn = screen.getByText(/Go back/i) as HTMLInputElement;
    expect(goBackBtn).toBeTruthy();
    await userEvent.click(goBackBtn);

    await waitFor(() => {
      expect(screen.queryByTestId(dismissDialogTestId)).not.toBeInTheDocument();
    });

    // user hits escape to close modal
    await userEvent.keyboard('{Escape}');

    // Should not cancel and should display confirm dismiss dialog instead
    expect(onCancelMock).not.toHaveBeenCalled();
    expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();
  });

  it('should dismiss create on confirm Dismiss Dialog', async () => {
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

    await userEvent.click(screen.getByTestId('link-create-form-button-cancel'));

    expect(await screen.findByTestId(dismissDialogTestId)).toBeInTheDocument();

    const discardBtn = screen.getByText(/Discard/i) as HTMLInputElement;
    expect(discardBtn).toBeTruthy();
    await userEvent.click(discardBtn);

    rerender({
      active: false,
    });

    await waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      expect(screen.queryByTestId(dismissDialogTestId)).not.toBeInTheDocument();
      expect(onCancelMock).toHaveBeenCalled();
    });
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
          await onSubmitSpy();
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

    it('should NOT show edit button when edit view is undefined even if `onComplete` is provided', async () => {
      setUpLinkCreate({
        plugins: [{ ...pluginWithEdit, editView: undefined }],
        onComplete: onCompleteMock,
      });

      expect(
        await screen.findByRole('button', { name: 'Create' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: editButtonLabel }),
      ).not.toBeInTheDocument();
    });

    it('with create form should show edit button when edit view and `onComplete` is provided', async () => {
      setUpLinkCreate({
        plugins: [pluginWithEdit],
        onComplete: onCompleteMock,
      });

      expect(
        await screen.findByRole('button', { name: 'Create' }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole('button', { name: editButtonLabel }),
      ).toBeInTheDocument();
    });

    it('onCloseComplete should only be called when active changes from `true` to `false`', async () => {
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
    });

    it('with create form + edit view should render editView when edit button is clicked', async () => {
      const { rerender } = setUpLinkCreate({
        active: true,
        plugins: [pluginWithEdit],
        onComplete: onCompleteMock,
      });

      const editButton = await screen.findByRole('button', {
        name: editButtonLabel,
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
      expect(onAnalyticsEventMock).toBeFiredWithAnalyticEventOnce({
        payload: {
          eventType: 'screen',
          name: 'linkCreateEditScreen',
          action: 'viewed',
        },
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
    });

    it('with create form + edit view should NOT render editView when create button is clicked', async () => {
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
        expect(screen.queryByTestId('link-create-modal')).toBeInTheDocument();
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
    });

    it('with create form + edit view should NOT render editView when close button is clicked', async () => {
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
    });

    it('should NOT trigger the edit flow if the form fails to submit (does not call onCreate)', async () => {
      onSubmitSpy.mockImplementation(
        () =>
          new Promise((_, rej) => {
            setTimeout(rej, 1000);
          }),
      );

      setUpLinkCreate({
        plugins: [pluginWithEdit],
        onComplete: onCompleteMock,
      });

      await userEvent.click(
        await screen.findByRole('button', {
          name: editButtonLabel,
        }),
      );

      // Enters submitting state
      await waitFor(() => {
        expect(
          screen.getByRole('button', {
            name: `${editButtonLabel} , Loading`,
          }),
        ).toHaveAttribute('aria-disabled', 'true');
      });

      // Exits sumitting state
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: editButtonLabel }),
        ).not.toHaveAttribute('aria-disabled');
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
    });
  });
});
