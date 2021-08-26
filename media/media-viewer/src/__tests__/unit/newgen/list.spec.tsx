import React from 'react';
import {
  Identifier,
  FileIdentifier,
  FileState,
  createFileStateSubject,
} from '@atlaskit/media-client';
import { List, Props, State } from '../../../list';
import { nextNavButtonId } from '../../../navigation';
import { ItemViewer } from '../../../item-viewer';
import {
  mountWithIntlContext,
  fakeMediaClient,
  asMockReturnValue,
} from '@atlaskit/media-test-helpers';

function createFixture(props: Partial<Props>) {
  const items: FileIdentifier[] = [];
  const selectedItem: Identifier = {
    id: '',
    occurrenceKey: '',
    mediaItemType: 'file',
  };
  const defaultFileState: FileState = {
    status: 'processed',
    id: '123',
    name: 'file-name',
    size: 10,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'image/png',
    representations: { image: {} },
  };
  const mockMediaClient = fakeMediaClient();

  asMockReturnValue(
    mockMediaClient.file.getFileState,
    createFileStateSubject(defaultFileState),
  );

  const el = mountWithIntlContext<Props, State>(
    <List
      items={items}
      defaultSelectedItem={selectedItem}
      mediaClient={mockMediaClient}
      {...props}
    />,
  );

  return el;
}

describe('<List />', () => {
  const identifier: Identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  it('should update navigation', () => {
    const identifier2: Identifier = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      mediaItemType: 'file',
    };
    const el = createFixture({
      items: [identifier, identifier2],
      defaultSelectedItem: identifier,
    });
    expect(el.state().selectedItem).toMatchObject({ id: 'some-id' });
    el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
    expect(el.state().selectedItem).toMatchObject({ id: 'some-id-2' });
  });

  it('should show controls when navigation occurs', () => {
    const showControls = jest.fn();
    const el = createFixture({
      items: [identifier, identifier, identifier],
      defaultSelectedItem: identifier,
      showControls,
    });

    el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
    el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
    expect(showControls).toHaveBeenCalledTimes(2);
  });

  describe('AutoPlay', () => {
    it('should pass ItemViewer an initial previewCount value of zero', () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        defaultSelectedItem: identifier,
        showControls,
      });
      const itemViewer = el.find(ItemViewer);
      expect(itemViewer.prop('previewCount')).toEqual(0);
    });

    it("should increase ItemViewer's previewCount on navigation", () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        defaultSelectedItem: identifier,
        showControls,
      });
      el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
      const itemViewer = el.find(ItemViewer);
      expect(itemViewer.prop('previewCount')).toEqual(1);
    });
  });
});
