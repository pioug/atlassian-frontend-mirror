import React from 'react';
import { InlineMediaCardInternal as InlineMediaCard } from '../../inlineMediaCard';
import { mount } from 'enzyme';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  fakeMediaClient,
  fakeIntl,
  asMock,
} from '@atlaskit/media-test-helpers';
import { InlineCardResolvingView } from '@atlaskit/media-ui';
import { render, waitForElement } from '@testing-library/react';

describe('<InlineMediaCard />', () => {
  const identifier: FileIdentifier = {
    id: '1234',
    mediaItemType: 'file',
  };
  const mediaClient = fakeMediaClient();
  it('should render loading view while loading media file', () => {
    const inlineMediaCard = mount(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );

    expect(inlineMediaCard.find(InlineCardResolvingView)).toHaveLength(1);
  });

  it('should render resolved view when media loads successfully', async () => {
    const { getByTestId, getByText } = render(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const resolvedView = await waitForElement(() =>
      getByTestId('inline-card-resolved-view'),
    );
    const title = await waitForElement(() => getByText('file_name'));

    expect(resolvedView).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
    const { getByTestId } = render(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        shouldOpenMediaViewer
      />,
    );
    const resolvedView = await waitForElement(() =>
      getByTestId('inline-card-resolved-view'),
    );

    resolvedView.click();

    const mediaViewer = await waitForElement(() =>
      getByTestId('media-viewer-popup'),
    );

    expect(mediaViewer).toBeTruthy();
  });

  it('should call onClick callback when provided', async () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        onClick={onClick}
      />,
    );
    const resolvedView = await waitForElement(() =>
      getByTestId('inline-card-resolved-view'),
    );

    resolvedView.click();

    expect(onClick).toBeCalledTimes(1);
  });

  it('should render right media file type icon', async () => {
    const { getByTestId } = render(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const fileTypeIcon = await waitForElement(() =>
      getByTestId('inline-media-card-file-type-icon'),
    );
    expect(fileTypeIcon.getAttribute('data-type')).toEqual('image');
    expect(fileTypeIcon).toBeTruthy();
  });

  it('should render error view', async () => {
    asMock(mediaClient.file.getCurrentState).mockResolvedValueOnce(
      Promise.resolve({ status: 'error' }),
    );
    const { getByTestId } = render(
      <InlineMediaCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const erroredView = await waitForElement(() =>
      getByTestId('inline-card-errored-view'),
    );

    expect(erroredView).toBeTruthy();
  });
});
