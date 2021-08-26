import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { FilePreviewItem } from '../../filePreviewItem';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('<FilePreviewItem />', () => {
  it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
    const mediaPluginState = {
      mediaClientConfig: {},
      selectedMediaContainerNode: jest.fn().mockReturnValue({
        attrs: { id: '1234', collection: 'collection-name' },
      }) as any,
    } as MediaPluginState;
    const { getByTestId } = render(
      <FilePreviewItem mediaPluginState={mediaPluginState} />,
    );
    const resolvedView = await waitForElement(() =>
      getByTestId('file-preview-toolbar-button'),
    );

    resolvedView.click();

    const mediaViewer = await waitForElement(() =>
      getByTestId('media-viewer-popup'),
    );

    expect(mediaViewer).toBeTruthy();
  });
});
