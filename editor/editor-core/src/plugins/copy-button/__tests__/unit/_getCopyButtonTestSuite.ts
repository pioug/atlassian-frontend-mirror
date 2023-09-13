import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';

import type { IntlShape, MessageDescriptor } from 'react-intl-next';
import type { FloatingToolbarButton } from '@atlaskit/editor-common/types';

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
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  describe(`floating toolbar copy button analytics: [${
    nodeName || nodeType
  }]: `, () => {
    it('should dispatch analytics event when copy button is clicked', () => {
      const createEditor = createEditorFactory();
      const editor = (doc: DocBuilder) => {
        createAnalyticsEvent = jest.fn(
          () => ({ fire() {} } as UIAnalyticsEvent),
        );
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
      const copyButton = getCopyButtonConfig(
        {
          state: editorView.state,
          formatMessage: dummyFormatMessage as IntlShape['formatMessage'],
          nodeType: editorView.state.schema.nodes[nodeType],
        },
        undefined,
      ) as FloatingToolbarButton<any>;

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
