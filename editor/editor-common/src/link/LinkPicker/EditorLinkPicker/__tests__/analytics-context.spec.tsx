import React, { useEffect } from 'react';

import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { LinkPicker } from '@atlaskit/link-picker';
import { renderWithIntl as render } from '@atlaskit/media-test-helpers/renderWithIntl';

import { EditorLinkPicker } from '../index';

jest.mock('@atlaskit/link-picker', () => {
  const originalModule = jest.requireActual('@atlaskit/link-picker');

  return {
    ...originalModule,
    LinkPicker: jest.fn(),
  };
});

describe('EditorLinkPicker analytics context', () => {
  const createEditor = createEditorFactory();

  beforeAll(() => {
    (LinkPicker as any).mockImplementation(() => {
      const { createAnalyticsEvent } = useAnalyticsEvents();

      useEffect(() => {
        createAnalyticsEvent({
          action: 'mounted',
          actionSubject: 'linkPicker',
        }).fire();
      }, [createAnalyticsEvent]);

      return null;
    });
  });

  it('provides `invokeMethod` attribute using prop', () => {
    const spy = jest.fn();
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();
    const invokeMethod = 'floatingToolbar';

    render(
      <AnalyticsListener onEvent={spy}>
        <EditorLinkPicker
          view={editorView}
          onSubmit={onSubmit}
          invokeMethod={invokeMethod}
        />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              invokeMethod,
            }),
          }),
        ],
        payload: expect.objectContaining({
          action: 'mounted',
          actionSubject: 'linkPicker',
        }),
      }),
      undefined,
    );
  });

  it('provides `invokeMethod` attribute defaults to `_unknown`', () => {
    const spy = jest.fn();
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();

    render(
      <AnalyticsListener onEvent={spy}>
        <EditorLinkPicker view={editorView} onSubmit={onSubmit} />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              invokeMethod: '_unknown',
            }),
          }),
        ],
        payload: expect.objectContaining({
          action: 'mounted',
          actionSubject: 'linkPicker',
        }),
      }),
      undefined,
    );
  });

  it('provides `locations` attribute using editorAppearance prop', () => {
    const spy = jest.fn();
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();
    const editorAppearance = 'full-width';

    render(
      <AnalyticsListener onEvent={spy}>
        <EditorLinkPicker
          view={editorView}
          onSubmit={onSubmit}
          editorAppearance={editorAppearance}
        />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `editor_fullWidth`,
            }),
          }),
        ],
        payload: expect.objectContaining({
          action: 'mounted',
          actionSubject: 'linkPicker',
        }),
      }),
      undefined,
    );
  });

  it('provides `locations` attribute with _unknown when editorAppearance is undefined', () => {
    const spy = jest.fn();
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();

    render(
      <AnalyticsListener onEvent={spy}>
        <EditorLinkPicker view={editorView} onSubmit={onSubmit} />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `_unknown`,
            }),
          }),
        ],
        payload: expect.objectContaining({
          action: 'mounted',
          actionSubject: 'linkPicker',
        }),
      }),
      undefined,
    );
  });
});
