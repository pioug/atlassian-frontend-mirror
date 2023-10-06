// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import React from 'react';
import Editor from '../../editor';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';

jest.mock('../../ui/Toolbar/hooks', () => ({
  ...jest.requireActual<Object>('../../ui/Toolbar/hooks'),
  useElementWidth: () => 1000,
}));

/**
 * Context:
 * A bug was discovered in the comment editor where if the plugin state of the
 * media plugin changes, the toolbar does not get added.
 *
 * This test confirms the behaviour that if we re-render the editor (with the media state
 * unavailable initially, then it is available) - that the toolbar button is added.
 *
 * See `MediaEditorStateCache` for more information on how the workaround is implemented.
 */
describe('media toolbar item', () => {
  it('should update the toolbar if the media provider re-renders with it available', async () => {
    const { rerender, getByRole, queryByRole } = renderWithIntl(
      <Editor
        appearance="comment"
        media={{
          provider: storyMediaProviderFactory({
            includeUploadMediaClientConfig: false,
          }),
          allowMediaSingle: true,
        }}
      />,
    );

    await flushPromises();

    // Is initially unavailable
    const element = queryByRole('button', {
      name: 'Add image, video, or file',
    });
    expect(element).toBeNull();

    rerender(
      <Editor
        appearance="comment"
        media={{
          provider: storyMediaProviderFactory({
            includeUploadMediaClientConfig: true,
          }),
          allowMediaSingle: true,
        }}
      />,
    );
    await flushPromises();

    // Updates on state change
    const newElement = getByRole('button', {
      name: 'Add image, video, or file',
    });
    expect(newElement).toBeInTheDocument();
  });
});
