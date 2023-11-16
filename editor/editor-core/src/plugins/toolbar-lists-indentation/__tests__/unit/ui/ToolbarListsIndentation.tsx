import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, indentation } from '@atlaskit/editor-test-helpers/doc-builder';
import { listMessages } from '@atlaskit/editor-common/messages';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import toolbarListsIndentationPlugin, {
  PrimaryToolbarComponent,
} from '../../../';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import taskDecisionPlugin from '../../../../../plugins/tasks-and-decisions';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import type { Props as ToolbarListsIndentationProps } from '../../../ui';
import ToolbarListsIndentation from '../../../ui';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { screen, fireEvent } from '@testing-library/react';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

async function clickToolbarOption(title: string) {
  const toolbarButton = await screen.findByTestId(title);
  fireEvent.click(toolbarButton);
}

describe('ToolbarListsIndentation', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const mockDispatchAnalyticsEvent = jest.fn();
  const mockAnalyticsPlugin = () => {
    return {
      name: 'analytics',
      actions: {
        attachAnalyticsEvent: (payload: any) => {
          mockDispatchAnalyticsEvent(payload);
          return () => {};
        },
      },
    };
  };
  createAnalyticsEvent = createAnalyticsEventMock();

  const editorWithoutMockAnaylticsPlugin = ({ doc }: { doc: DocBuilder }) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(blockTypePlugin)
        .add(indentationPlugin)
        .add(taskDecisionPlugin)
        .add([
          toolbarListsIndentationPlugin,
          {
            showIndentationButtons: true,
            allowHeadingAndParagraphIndentation: true,
          },
        ]),
    });
  };

  const editorWithMockAnaylticsPlugin = ({ doc }: { doc: DocBuilder }) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(mockAnalyticsPlugin)
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(blockTypePlugin)
        .add(indentationPlugin)
        .add(taskDecisionPlugin)
        .add([
          toolbarListsIndentationPlugin,
          {
            showIndentationButtons: true,
            allowHeadingAndParagraphIndentation: true,
          },
        ]),
    });
  };

  const setupWithoutMockAnalytics = (
    props: { doc?: DocBuilder } & Partial<ToolbarListsIndentationProps> = {},
  ) => {
    const { doc: setupDoc, ...toolbarProps } = props;
    const editorWrapper = editorWithoutMockAnaylticsPlugin({
      doc: setupDoc || doc(p('text')),
    });
    renderWithIntl(
      <PrimaryToolbarComponent
        editorView={editorWrapper.editorView}
        featureFlags={{}}
        pluginInjectionApi={editorWrapper.editorAPI}
        allowHeadingAndParagraphIndentation={true}
        isToolbarReducedSpacing={false}
        {...toolbarProps}
        disabled={toolbarProps.disabled ?? false}
        isSmall={toolbarProps.isSmall ?? false}
      />,
    );
    return {
      ...editorWrapper,
    };
  };

  const setupWithMockAnalytics = (
    props: { doc?: DocBuilder } & Partial<ToolbarListsIndentationProps> = {},
  ) => {
    const { doc: setupDoc, ...toolbarProps } = props;
    const editorWrapper = editorWithMockAnaylticsPlugin({
      doc: setupDoc || doc(p('text')),
    });
    const ToolbarListsIndentationWrapper = renderWithIntl(
      <ToolbarListsIndentation
        editorView={editorWrapper.editorView}
        featureFlags={{}}
        pluginInjectionApi={editorWrapper.editorAPI}
        {...toolbarProps}
      />,
    );
    return {
      ...editorWrapper,
      ToolbarListsIndentation: ToolbarListsIndentationWrapper,
    };
  };

  it('should render disabled ToolbarButtons if disabled property is true', async () => {
    setupWithMockAnalytics({
      disabled: true,
    });

    const buttons = await screen.findAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should not render indentation buttons if showIndentationButtons is false', async () => {
    setupWithMockAnalytics({
      showIndentationButtons: false,
    });
    const buttons = await screen.findAllByRole('button');

    expect(buttons.length).toEqual(2);
  });

  it('should render indentation buttons if showIndentationButtons is true', async () => {
    setupWithMockAnalytics({
      showIndentationButtons: true,
    });

    const buttons = await screen.findAllByRole('button');

    expect(buttons.length).toEqual(4);
  });

  it('should have a dropdown if option isSmall = true', async () => {
    setupWithMockAnalytics({
      isSmall: true,
    });

    const buttons = await screen.findAllByRole('button');

    expect(buttons.length).toEqual(1);
  });

  describe('list analytics', () => {
    beforeEach(() => {
      setupWithMockAnalytics();
    });

    it('should dispatch analytics event when bulleted list button is clicked', async () => {
      await clickToolbarOption(listMessages.unorderedList.defaultMessage);

      expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'bulletedList',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
      });
    });

    it('should dispatch analytics event when numbered list button is clicked', async () => {
      await clickToolbarOption(listMessages.orderedList.defaultMessage);

      expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'numberedList',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
      });
    });
  });

  describe('indentation buttons analytics', () => {
    it('should dispatch analytics event when indent button is clicked', async () => {
      setupWithoutMockAnalytics({
        showIndentationButtons: true,
        indentDisabled: false,
        doc: doc(p('{<>}hello world')),
      });

      await clickToolbarOption('indent');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          direction: 'indent',
        }),
      });
    });

    it('should dispatch analytics event when outdent button is clicked', async () => {
      setupWithoutMockAnalytics({
        showIndentationButtons: true,
        outdentDisabled: false,
        doc: doc(indentation({ level: 1 })(p('{<>}hello world'))),
      });

      await clickToolbarOption('outdent');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          direction: 'outdent',
        }),
      });
    });
  });

  describe('keyboard shortcuts', () => {
    it('should have ARIA keyshortcuts attribute', () => {
      setupWithMockAnalytics({ showIndentationButtons: true, doc: doc(p('')) });
      expect(
        screen.getByTestId('Bullet list').getAttribute('aria-keyshortcuts'),
      ).toEqual('Control+Shift+8');
      expect(
        screen.getByTestId('Numbered list').getAttribute('aria-keyshortcuts'),
      ).toEqual('Control+Shift+7');
      expect(
        screen.getByTestId('indent').getAttribute('aria-keyshortcuts'),
      ).toEqual('Tab');
      expect(
        screen.getByTestId('outdent').getAttribute('aria-keyshortcuts'),
      ).toEqual('Shift+Tab');
    });
  });
});
