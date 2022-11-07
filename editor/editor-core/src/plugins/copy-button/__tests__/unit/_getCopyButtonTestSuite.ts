import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../../plugins/analytics';

import { IntlShape, MessageDescriptor } from 'react-intl-next';
import { FloatingToolbarButton } from '../../../../plugins/floating-toolbar/types';

import { getCopyButtonConfig } from '../../../copy-button/toolbar';

export async function _getCopyButtonTestSuite({
  nodeType,
  nodeName,
  editorOptions,
  doc,
}: {
  nodeType: string;
  nodeName?: string;
  editorOptions?: any;
  doc: DocBuilder;
}) {
  const dummyFormatMessage = (messageDescriptor: MessageDescriptor) =>
    (messageDescriptor.defaultMessage as string) || '';

  describe(`floating toolbar copy button analytics: [${
    nodeName || nodeType
  }]: `, () => {
    const createEditor = createEditorFactory();
    let createAnalyticsEvent: CreateUIAnalyticsEvent;

    const editor = (doc: DocBuilder) => {
      createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
      return createEditor({
        doc,
        editorProps: {
          allowAnalyticsGASV3: true,
          ...editorOptions,
        },
        createAnalyticsEvent,
      });
    };

    const { editorView } = editor(doc);

    it('should dispatch analytics event when copy button is clicked', () => {
      const copyButton = getCopyButtonConfig({
        state: editorView.state,
        formatMessage: dummyFormatMessage as IntlShape['formatMessage'],
        nodeType: editorView.state.schema.nodes[nodeType],
      }) as FloatingToolbarButton<any>;

      copyButton.onClick(editorView.state, editorView.dispatch);

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.COPIED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.FLOATING_TB,
          nodeType,
        }),
      });
    });
  });
}
