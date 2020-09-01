import React, { useEffect } from 'react';
import { waitForElement, cleanup } from '@testing-library/react';

let mockModalRender = jest.fn();
jest.mock('../../../../BlockCard/components/Modal', () => ({
  __esModule: true,
  default: (...args: any) => mockModalRender(...args),
}));

import PreviewAction, {
  previewFunction,
} from '../../../../BlockCard/actions/PreviewAction';
import { renderWithIntl } from '../../../__utils__/render';

describe('PreviewAction', () => {
  beforeEach(() => {
    mockModalRender = jest
      .fn()
      .mockImplementation(() => <div>My modal mock</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('sets up a renderer function which runs on execution of promise handler', async () => {
    const action = PreviewAction({});
    expect(action).toEqual({
      id: 'preview-content',
      text: expect.any(Object),
      promise: expect.any(Function),
    });

    const { container } = renderWithIntl(action.text);
    expect(container.textContent).toBe('Preview');

    const handlerExecutor = action.promise;
    await handlerExecutor();
    expect(mockModalRender).toBeCalledTimes(1);
    expect(mockModalRender).toBeCalledWith(
      {
        closeLabel: 'Close Preview',
        iframeName: 'twp-editor-preview-iframe',
        metadata: { items: [] },
        onClose: expect.any(Function),
        providerName: 'Preview',
        showModal: true,
      },
      {},
    );
  });

  it('renders correctly using the previewFunction', async () => {
    const mockOnClose = jest.fn();
    const mockPopupMountPointId = 'twp-editor-preview-iframe';

    const PreviewWrapper = () => {
      useEffect(() => {
        previewFunction({
          popupMountPointId: mockPopupMountPointId,
          onClose: mockOnClose,
          iframeName: 'my-iframe',
          closeLabel: 'my-close-label',
        });
      }, []);
      return <div>My Preview</div>;
    };

    const { getByTestId } = renderWithIntl(<PreviewWrapper />);
    const modal = await waitForElement(() => getByTestId('preview-modal'));
    expect(modal).toBeTruthy();
    expect(modal.textContent).toBe('My modal mock');
    expect(modal.id).toBe(mockPopupMountPointId);
  });
});
