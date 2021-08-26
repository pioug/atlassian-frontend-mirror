jest.mock('../../../analytics/events/operational/loadFailed', () => ({
  createLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../analytics/events/operational/previewUnsupported', () => ({
  createPreviewUnsupportedEvent: jest.fn(),
}));
import React from 'react';
import { mount } from 'enzyme';
import { ErrorMessage } from '../../../errorMessage';
import { MediaViewerError } from '../../../errors';
import Button from '@atlaskit/button/custom-theme-button';
import {
  fakeIntl,
  smallImageFileId,
  asMock,
} from '@atlaskit/media-test-helpers';
import { FileState } from '@atlaskit/media-client';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { createLoadFailedEvent } from '../../../analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from '../../../analytics/events/operational/previewUnsupported';

describe('Error Message', () => {
  describe('Mapping error reason to message text', () => {
    it('should map error reason to translated message', () => {
      const el = mount(
        <ErrorMessage
          fileId="some-id"
          intl={fakeIntl}
          error={
            new MediaViewerError('itemviewer-file-failed-processing-status')
          }
        />,
      );
      expect(el.text()).toContain(
        i18nMessages.image_format_invalid_error.defaultMessage,
      );
    });
  });

  it('should render a child component', () => {
    const el = mount(
      <ErrorMessage
        intl={fakeIntl}
        fileId="some-id"
        error={new MediaViewerError('unsupported')}
      >
        <Button />
      </ErrorMessage>,
    );
    expect(el.find(Button)).toHaveLength(1);
  });

  describe('analytics', () => {
    const fileState: FileState = {
      id: '1',
      status: 'processing',
      mediaType: 'audio',
      mimeType: 'audio/mp3',
      name: 'me.mp3',
      size: 1,
    };

    beforeEach(() => {
      asMock(createPreviewUnsupportedEvent).mockReset();
      asMock(createLoadFailedEvent).mockReset();
    });

    it('should trigger load fail event when displayed if error reason not "unsupported"', () => {
      const error = new MediaViewerError('unsupported');

      mount(
        <ErrorMessage
          intl={fakeIntl}
          fileId="some-id"
          error={error}
          fileState={fileState}
        >
          <Button />
        </ErrorMessage>,
      );
      expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
      expect(createLoadFailedEvent).not.toHaveBeenCalled();
    });

    it('should trigger load fail event when displayed if error reason not "unsupported"', () => {
      const error = new MediaViewerError('imageviewer-fetch-url');
      mount(
        <ErrorMessage
          intl={fakeIntl}
          fileId={smallImageFileId.id}
          error={error}
          fileState={fileState}
        >
          <Button />
        </ErrorMessage>,
      );
      expect(createLoadFailedEvent).toHaveBeenCalledWith(
        smallImageFileId.id,
        error,
        fileState,
      );
      expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
    });

    it('should not trigger loadFailed if supressAnalytics prop passed', () => {
      jest.resetAllMocks();
      const error = new MediaViewerError('imageviewer-fetch-url');
      mount(
        <ErrorMessage
          intl={fakeIntl}
          fileId={smallImageFileId.id}
          error={error}
          fileState={fileState}
          supressAnalytics={true}
        >
          <Button />
        </ErrorMessage>,
      );
      expect(createLoadFailedEvent).not.toHaveBeenCalled();
      expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
    });

    it('should give unsupported payload for correct error', () => {
      ErrorMessage.getEventPayload(
        new MediaViewerError('unsupported'),
        'some-id',
        fileState,
      );
      expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
      expect(createLoadFailedEvent).not.toHaveBeenCalled();
    });

    it('should give external image fail payload for correct error', () => {
      ErrorMessage.getEventPayload(
        new MediaViewerError('imageviewer-external-onerror'),
        'some-id',
        fileState,
      );
      expect(createLoadFailedEvent).toHaveBeenCalledWith(
        'some-id',
        new Error('imageviewer-external-onerror'),
        fileState,
      );
      expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
    });

    it('should give load fail for other MediaViewerErrors', () => {
      const error = new MediaViewerError('imageviewer-fetch-url');
      ErrorMessage.getEventPayload(error, 'some-id', fileState);
      expect(createLoadFailedEvent).toHaveBeenCalledWith(
        'some-id',
        error,
        fileState,
      );
      expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
    });
  });
});
