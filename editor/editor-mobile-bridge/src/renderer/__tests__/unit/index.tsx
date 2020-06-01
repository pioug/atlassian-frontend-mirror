import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import MobileRenderer from '../../mobile-renderer-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import DummyBridge from '../../../editor/web-to-native/dummy-impl';
jest.mock('../../../editor/web-to-native/dummy-impl');

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'sme unresolved copy',
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: '18983b72-dd27-41f4-9171-a4f2e180ca83',
              },
            },
          ],
        },
      ],
    },
  ],
});

describe('renderer bridge', () => {
  let mobileRenderer: ReactWrapper<MobileRenderer>;
  const createPromiseMock = jest.fn();

  const initRenderer = (
    adf: string,
    allowAnnotations: boolean,
  ): ReactWrapper<MobileRenderer> =>
    mount(
      <MobileRenderer
        document={adf}
        cardClient={createCardClient()}
        emojiProvider={createEmojiProvider()}
        mediaProvider={createMediaProvider()}
        mentionProvider={createMentionProvider()}
        allowAnnotations={allowAnnotations}
      />,
    );

  beforeEach(() => {
    createPromiseMock.mockReset();
    window.renderBridge = {
      onContentRendered: jest.fn(),
      onRenderedContentHeightChanged: jest.fn(),
    };
  });

  afterEach(() => {
    mobileRenderer.unmount();
  });

  describe('annotations', () => {
    let instanceMock: jest.Mocked<DummyBridge>;
    const expected = [
      [
        'getAnnotationStates',
        expect.any(String),
        '{"annotationIds":["18983b72-dd27-41f4-9171-a4f2e180ca83"],"annotationType":"inlineComment"}',
      ],
    ];

    beforeEach(() => {
      // @ts-ignore
      instanceMock = DummyBridge.mock.instances[0];
    });

    describe('when allowAnnotations is false', () => {
      it(`should not call getAnnotationStates birdge method on renderer`, () => {
        mobileRenderer = initRenderer(initialDocument, false);
        expect(instanceMock.submitPromise.mock.calls).toEqual(
          expect.not.arrayContaining(expected),
        );
      });
    });
    describe('when allowAnnotations is true', () => {
      it(`should call getAnnotationStates birdge method on renderer`, () => {
        mobileRenderer = initRenderer(initialDocument, true);
        expect(instanceMock.submitPromise.mock.calls).toEqual(
          expect.arrayContaining(expected),
        );
      });
    });
  });
});
