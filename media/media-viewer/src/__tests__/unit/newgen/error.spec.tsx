const itemViewerModule = require.requireActual(
  '../../../newgen/analytics/item-viewer',
);
const archiveViewerModule = require.requireActual(
  '../../../newgen/analytics/archive-viewer',
);
const mediaPreviewFailedEventSpy = jest.fn();
const zipEntryLoadFailedEventSpy = jest.fn();
const mockItemViewer = {
  ...itemViewerModule,
  mediaPreviewFailedEvent: mediaPreviewFailedEventSpy,
};

const mockArchiveViewer = {
  ...archiveViewerModule,
  zipEntryLoadFailedEvent: zipEntryLoadFailedEventSpy,
};

jest.mock('../../../newgen/analytics/item-viewer', () => mockItemViewer);
jest.mock('../../../newgen/analytics/archive-viewer', () => mockArchiveViewer);

import React from 'react';
import { mount } from 'enzyme';
import { ErrorMessage, createError } from '../../../newgen/error';
import Button from '@atlaskit/button';
import { fakeIntl } from '@atlaskit/media-test-helpers';
import { FileState } from '@atlaskit/media-client';
import { ZipEntry } from 'unzipit';

describe('Error Message', () => {
  it('should render the right error for retrieving metadata', () => {
    const el = mount(
      <ErrorMessage intl={fakeIntl} error={createError('metadataFailed')} />,
    );
    expect(el.text()).toContain(
      'Something went wrong.It might just be a hiccup.',
    );
  });

  it('should render the right error for generating a preview', () => {
    const el = mount(
      <ErrorMessage intl={fakeIntl} error={createError('previewFailed')} />,
    );
    expect(el.text()).toContain("We couldn't generate a preview for this file");
  });

  it('should render the right error for generating a preview for an encrypted zip entry', () => {
    const el = mount(
      <ErrorMessage
        intl={fakeIntl}
        error={createError('encryptedEntryPreviewFailed')}
      />,
    );
    expect(el.text()).toContain(
      "We can't preview encrypted or password protected files.",
    );
  });

  it('should render the right error when the id is not found', () => {
    const el = mount(
      <ErrorMessage intl={fakeIntl} error={createError('idNotFound')} />,
    );
    expect(el.text()).toContain('The selected item was not found on the list');
  });

  it('should render the right error when the PDF artifact does not exist', () => {
    const el = mount(
      <ErrorMessage
        intl={fakeIntl}
        error={createError('noPDFArtifactsFound')}
      />,
    );
    expect(el.text()).toContain('No PDF artifacts found for this file');
  });

  it('should render the right error when the file type is unsupported', () => {
    const el = mount(
      <ErrorMessage intl={fakeIntl} error={createError('unsupported')} />,
    );
    expect(el.text()).toContain("We can't preview this file type.");
  });

  it('should render a child component', () => {
    const el = mount(
      <ErrorMessage intl={fakeIntl} error={createError('unsupported')}>
        <Button />
      </ErrorMessage>,
    );
    expect(el.find(Button)).toHaveLength(1);
  });

  describe('analytics', () => {
    it('should trigger analytics when displayed', () => {
      mount(
        <ErrorMessage intl={fakeIntl} error={createError('unsupported')}>
          <Button />
        </ErrorMessage>,
      );
      expect(mediaPreviewFailedEventSpy).toHaveBeenCalledWith(
        'unsupported',
        undefined,
      );
    });

    it('should pass fileState to the error', () => {
      const fileState: FileState = {
        id: '1',
        status: 'processing',
        mediaType: 'audio',
        mimeType: 'audio/mp3',
        name: 'me.mp3',
        size: 1,
      };

      mount(
        <ErrorMessage
          intl={fakeIntl}
          error={createError('unsupported', undefined, fileState)}
        >
          <Button />
        </ErrorMessage>,
      );
      expect(mediaPreviewFailedEventSpy).toHaveBeenCalledWith(
        'unsupported',
        fileState,
      );
    });
    it('should pass zipEntry to the error', () => {
      const zipEntry: ZipEntry = {
        name: 'entry1',
      } as any;
      const innerError = new Error('innerError');
      mount(
        <ErrorMessage
          intl={fakeIntl}
          error={createError('previewFailed', innerError, undefined, zipEntry)}
        >
          <Button />
        </ErrorMessage>,
      );
      expect(zipEntryLoadFailedEventSpy).toHaveBeenCalledWith(
        innerError,
        zipEntry,
        undefined,
      );
    });
  });
});
