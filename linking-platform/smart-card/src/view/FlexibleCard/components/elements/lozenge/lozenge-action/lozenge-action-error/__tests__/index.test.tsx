import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import LozengeActionError from '../index';
import * as useResolve from '../../../../../../../../state/hooks/use-resolve';
import { LozengeActionErrorMessages, type LozengeActionErrorProps } from '../types';

const mockSmartLinkLozengeOpenPreviewClickedEvent = jest.fn();

jest.mock('../../../../../../../../state/flexible-ui-context', () => ({
  useFlexibleUiAnalyticsContext: () => ({
    ui: {
      smartLinkLozengeActionErrorOpenPreviewClickedEvent:
        mockSmartLinkLozengeOpenPreviewClickedEvent,
      modalClosedEvent: jest.fn(),
      renderSuccessEvent: jest.fn(),
    },
    screen: {
      modalViewedEvent: jest.fn(),
    },
  }),
}));

describe('LozengeActionError', () => {
  const testId = 'test-smart-element-lozenge-dropdown';
  const TEXT_ERROR_MESSAGE =
    'Field "root cause" must be filled out before status change';
  const MESSAGE_PROP_ERROR_MESSAGE = LozengeActionErrorMessages.noData;
  const MAX_LINE_NUMBER = 20;
  const url = 'https://linchen.jira-dev.com/browse/AT-1';

  const previewData = {
    isSupportTheming: true,
    linkIcon: {
      url: 'https://linchen.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
    },
    providerName: 'Jira',
    src: 'https://some-jira-instance/browse/AT-1/embed?parentProduct=smartlink',
    title: 'AT-1: TESTTTTTT',
    url,
  };

  const renderComponent = (
    props: LozengeActionErrorProps,
    mockResolve = jest.fn(),
  ) => {
    jest.spyOn(useResolve, 'default').mockReturnValue(mockResolve);

    return render(
      <IntlProvider locale="en">
        <LozengeActionError testId={testId} {...props} />,
      </IntlProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component correctly when provided a text errorMessage & a preview action is available', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
      previewData,
      url,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(TEXT_ERROR_MESSAGE);
    expect(errorMessage).toHaveStyleDeclaration('-webkit-line-clamp', '8');

    // make sure an error link is present
    const link = await findByTestId(`${testId}-open-embed`);
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Open issue in Jira');
  });

  it('does not render preview modal link if a preview action is not available', async () => {
    const { findByTestId, queryByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(TEXT_ERROR_MESSAGE);
    expect(errorMessage).toHaveStyleDeclaration('-webkit-line-clamp', '8');

    // make sure an error link is not present
    const link = await queryByTestId(`${testId}-open-embed`);
    expect(link).toBeNull();
  });

  it('renders component correctly when provided a MessageProps errorMessage', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: MESSAGE_PROP_ERROR_MESSAGE,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(
      MESSAGE_PROP_ERROR_MESSAGE.descriptor.defaultMessage,
    );
    expect(errorMessage).toHaveStyleDeclaration('-webkit-line-clamp', '8');
  });

  it('renders with a specific maxLineNumber', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
      maxLineNumber: MAX_LINE_NUMBER,
    });

    // make sure icon is loaded
    const icon = await findByTestId(`${testId}-icon`);
    expect(icon).toBeDefined();

    // make sure error text is correct
    const errorMessage = await findByTestId(`${testId}-error-message`);
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toEqual(TEXT_ERROR_MESSAGE);
    expect(errorMessage).toHaveStyleDeclaration(
      '-webkit-line-clamp',
      MAX_LINE_NUMBER.toString(),
    );
  });

  it('opens an preview modal on error link click', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
      previewData,
      url,
    });

    // make sure an error link is present
    const link = await findByTestId(`${testId}-open-embed`);
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Open issue in Jira');

    link.click();

    const previewModal = await findByTestId('smart-embed-preview-modal');
    expect(previewModal).toBeDefined();
  });

  it('reloads the link on preview modal close', async () => {
    const mockReload = jest.fn();
    const { findByTestId, queryByTestId } = renderComponent(
      {
        errorMessage: TEXT_ERROR_MESSAGE,
        previewData,
        url,
      },
      mockReload,
    );

    // make sure an error link is present
    const link = await findByTestId(`${testId}-open-embed`);
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Open issue in Jira');

    link.click();

    // make sure the preview modal is present
    const previewModal = await findByTestId('smart-embed-preview-modal');
    expect(previewModal).toBeDefined();

    const closeButton = await findByTestId(
      'smart-embed-preview-modal-close-button',
    );
    expect(closeButton).toBeDefined();
    closeButton.click();

    await waitForElementToBeRemoved(() =>
      queryByTestId('smart-embed-preview-modal'),
    );
    expect(mockReload).toHaveBeenCalledWith(url, true);
  });

  it('fires button clicked event with smartLinkStatusOpenPreview subject id when an embed preview is open', async () => {
    const { findByTestId } = renderComponent({
      errorMessage: TEXT_ERROR_MESSAGE,
      previewData,
      url,
    });

    // make sure an error link is present
    const link = await findByTestId(`${testId}-open-embed`);
    expect(link).toBeDefined();
    expect(link.textContent).toBe('Open issue in Jira');

    link.click();

    // make sure the preview modal is present
    const previewModal = await findByTestId('smart-embed-preview-modal');
    expect(previewModal).toBeDefined();

    const closeButton = await findByTestId(
      'smart-embed-preview-modal-close-button',
    );
    expect(closeButton).toBeDefined();
    closeButton.click();

    expect(mockSmartLinkLozengeOpenPreviewClickedEvent).toHaveBeenCalledTimes(
      1,
    );
  });
});
