import React from 'react';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  code_block,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ReactWrapper } from 'enzyme';

import {
  TextColorPluginState,
  pluginKey,
} from '../../../../../plugins/text-color/pm-plugins/main';
// import Color from '../../../../../ui/ColorPalette/Color';
import { Color } from '@atlaskit/editor-common/ui-color';

import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  ToolbarTextColor,
  Props as ToolbarTextColorProps,
} from '../../../../../plugins/text-color/ui/ToolbarTextColor';
import { PaletteColor } from '../../../../../ui/ColorPalette/Palettes/type';
import { createIntl } from 'react-intl-next';

const mockDispatchAnalytics = jest.fn(() => () => {});

/**
 * Simulate a click on the toolbar button to show/hide the palette.
 * @param toolbarTextColor ToolbarTextColor enzyme wrapper
 */
function clickToolbarButton(
  toolbarTextColor: ReactWrapper<ToolbarTextColorProps>,
) {
  toolbarTextColor.find('button[aria-label="Text color"]').simulate('click');
}

/**
 * Simulate a click color
 * @param toolbarTextColor ToolbarTextColor enzyme wrapper
 * @param color
 */
function clickColor(
  toolbarTextColor: ReactWrapper<ToolbarTextColorProps>,
  color?: { hexCode: string } | null,
) {
  if (!color) {
    return;
  }

  toolbarTextColor
    .find(`ColorPalette Color`)
    .filterWhere((n) => n.prop('value') === color.hexCode)
    .find('button')
    .simulate('click');
}

/**
 * Get a color information from a palette of color
 *
 * @param {Map<string, string>} palette
 * @param {number} position
 * @returns Color information
 */
function getColorFromPalette(palette: PaletteColor[], position: number) {
  if (palette.length === 0 || palette.length < position) {
    return null;
  }

  const { value, label } = palette[position];

  return {
    hexCode: value,
    label,
  };
}

describe('ToolbarTextColor', () => {
  const createEditor = createEditorFactory<TextColorPluginState>();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;
  let toolbarTextColor: ReactWrapper<ToolbarTextColorProps>;

  const editor = (doc: DocBuilder, props: any = {}) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTextColor: true,
        ...props,
      },
      pluginKey,
      createAnalyticsEvent: createAnalyticsEvent as any,
    });
  };

  afterEach(() => {
    if (toolbarTextColor && typeof toolbarTextColor.unmount === 'function') {
      toolbarTextColor.unmount();
    }
  });

  describe('inside a valid node', () => {
    let pluginState: TextColorPluginState;

    beforeEach(() => {
      const { editorView } = editor(doc(p('text')));
      pluginState = pluginKey.getState(editorView.state);
      mockDispatchAnalytics.mockClear();
      const intl = createIntl({ locale: 'en' });

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
          intl={intl}
          pluginState={pluginState}
          editorView={editorView}
          dispatchAnalyticsEvent={mockDispatchAnalytics}
        />,
      );
    });

    it('should sets disabled to false', () => {
      expect(toolbarTextColor.prop('pluginState').disabled).toBe(false);
    });

    it('should initialize with isOpen false', () => {
      expect(toolbarTextColor.state('isOpen')).toBe(false);
    });

    it('should make isOpen true when toolbar textColor button is clicked', () => {
      clickToolbarButton(toolbarTextColor);

      expect(toolbarTextColor.state('isOpen')).toBe(true);
    });

    it('should make isOpen false when a color is clicked', () => {
      clickToolbarButton(toolbarTextColor);
      clickColor(toolbarTextColor, getColorFromPalette(pluginState.palette, 1)); // click on second color from palette

      expect(toolbarTextColor.state('isOpen')).toBe(false);
    });

    it('should make isOpen false when toolbar textColor button is clicked again', () => {
      clickToolbarButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);

      expect(toolbarTextColor.state('isOpen')).toBe(false);
    });

    it('should have Color components as much as size of color palette', () => {
      clickToolbarButton(toolbarTextColor);

      expect(toolbarTextColor.find(Color).length).toEqual(
        pluginState.palette.length,
      );
    });

    describe('analytics', () => {
      it('should create analytics event when color change', () => {
        const defaultColor = getColorFromPalette(pluginState.palette, 0);
        const color = getColorFromPalette(pluginState.palette, 1); // Get not default (0) color

        clickToolbarButton(toolbarTextColor);
        clickColor(toolbarTextColor, color);

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId: 'color',
          eventType: 'track',
          attributes: expect.objectContaining({
            newColor: color!.label.toLowerCase(),
            previousColor: defaultColor!.label.toLowerCase(),
          }),
        });
      });
    });

    it('should create analytics when palette shown', () => {
      clickToolbarButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'opened',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'control',
            noSelect: false,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when palette shown and closed', () => {
      clickToolbarButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'closed',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'control',
            noSelect: true,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when a color is selected', () => {
      const { palette } = pluginState;
      const color = getColorFromPalette(palette, 2);

      clickToolbarButton(toolbarTextColor);
      clickColor(toolbarTextColor, color);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId: 'color',
          attributes: {
            color: 'dark teal',
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'control',
            isNewColor: true,
          },
          eventType: 'track',
        }),
      );
    });
  });

  describe('inside an invalid node', () => {
    beforeEach(() => {
      const { editorView } = editor(doc(code_block()('text')));
      const pluginState = pluginKey.getState(editorView.state);
      mockDispatchAnalytics.mockClear();
      const intl = createIntl({ locale: 'en' });

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
          intl={intl}
          pluginState={pluginState}
          editorView={editorView}
          dispatchAnalyticsEvent={mockDispatchAnalytics}
        />,
      );
    });

    it('sets disabled to true', () => {
      expect(toolbarTextColor.prop('pluginState').disabled).toBe(true);
    });

    it('should render disabled ToolbarButton', () => {
      expect(toolbarTextColor.find(ToolbarButton).prop('disabled')).toBe(true);
    });
  });
});
