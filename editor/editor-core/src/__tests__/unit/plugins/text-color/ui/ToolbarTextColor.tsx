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
import Button from '@atlaskit/button/custom-theme-button';

import {
  TextColorPluginState,
  pluginKey,
} from '../../../../../plugins/text-color/pm-plugins/main';
import Color from '../../../../../ui/ColorPalette/Color';
import ColorPalette from '../../../../../ui/ColorPalette';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import ToolbarTextColor, {
  Props as ToolbarTextColorProps,
} from '../../../../../plugins/text-color/ui/ToolbarTextColor';
import { ShowMoreWrapper } from '../../../../../plugins/text-color/ui/ToolbarTextColor/styles';
import { PaletteColor } from '../../../../../ui/ColorPalette/Palettes/type';

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
 * Simulate a click on the show more/less colours button.
 * @param toolbarTextColor ToolbarTextColor enzyme wrapper
 */
function clickTogglePaletteButton(
  toolbarTextColor: ReactWrapper<ToolbarTextColorProps>,
) {
  toolbarTextColor
    .find(ShowMoreWrapper)
    .find(Button)
    .simulate('click', {
      nativeEvent: { stopImmediatePropagation: function () {} },
    });
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

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
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
            isShowingMoreColors: false,
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
            isShowingMoreColors: false,
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
            color: 'purple',
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'control',
            isNewColor: false,
            isShowingMoreColors: false,
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

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
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

  describe('when showMoreColorsToggle is disabled', () => {
    let pluginState: TextColorPluginState;

    beforeEach(() => {
      const { editorView } = editor(doc(p('text')));
      pluginState = pluginKey.getState(editorView.state);
      mockDispatchAnalytics.mockClear();

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
          pluginState={pluginState}
          editorView={editorView}
          showMoreColorsToggle={false}
          dispatchAnalyticsEvent={mockDispatchAnalytics}
        />,
      );
    });

    it('should not show "more colors" button', () => {
      clickToolbarButton(toolbarTextColor);

      expect(toolbarTextColor.find(ShowMoreWrapper).find(Button).length).toBe(
        0,
      );
    });
  });

  describe('when showMoreColorsToggle is enabled', () => {
    let pluginState: TextColorPluginState;

    beforeEach(() => {
      const props = {
        allowTextColor: {
          allowMoreTextColors: true,
        },
      };
      const { editorView } = editor(doc(p('text')), props);
      pluginState = pluginKey.getState(editorView.state);
      mockDispatchAnalytics.mockClear();

      toolbarTextColor = mountWithIntl(
        <ToolbarTextColor
          pluginState={pluginState}
          editorView={editorView}
          showMoreColorsToggle
          dispatchAnalyticsEvent={mockDispatchAnalytics}
        />,
      );
    });

    it('should show "more colors" button', () => {
      clickToolbarButton(toolbarTextColor);

      expect(toolbarTextColor.find(ShowMoreWrapper).find(Button).length).toBe(
        1,
      );
    });

    it('should show more colors when expanded', () => {
      clickToolbarButton(toolbarTextColor);

      const collapsedColorCount = toolbarTextColor
        .find(ColorPalette)
        .find(Color).length;

      clickTogglePaletteButton(toolbarTextColor);

      expect(
        toolbarTextColor.find(ColorPalette).find(Color).length,
      ).toBeGreaterThan(collapsedColorCount);
    });

    it('should show less colors when collapsed again', () => {
      clickToolbarButton(toolbarTextColor);

      const collapsedColorCount = toolbarTextColor
        .find(ColorPalette)
        .find(Color).length;

      clickTogglePaletteButton(toolbarTextColor);

      const expandedColorCount = toolbarTextColor.find(ColorPalette).find(Color)
        .length;

      clickTogglePaletteButton(toolbarTextColor);

      expect(toolbarTextColor.find(ColorPalette).find(Color).length).toBe(
        collapsedColorCount,
      );
      expect(
        toolbarTextColor.find(ColorPalette).find(Color).length,
      ).toBeLessThan(expandedColorCount);
    });

    it('should stay expanded when palette is shown again', () => {
      expect(toolbarTextColor.state('isShowingMoreColors')).toBe(false);
      // open toolbar
      clickToolbarButton(toolbarTextColor);
      expect(toolbarTextColor.state('isShowingMoreColors')).toBe(false);

      // expand more colours
      clickTogglePaletteButton(toolbarTextColor);

      expect(toolbarTextColor.state('isShowingMoreColors')).toBe(true);

      // close toolbar
      clickToolbarButton(toolbarTextColor);

      // open toolbar
      clickToolbarButton(toolbarTextColor);
      expect(toolbarTextColor.state('isShowingMoreColors')).toBe(true);
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
            experimentGroup: 'subject',
            isShowingMoreColors: false,
            noSelect: false,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when palette opened and closed without selection', () => {
      clickToolbarButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'closed',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            isShowingMoreColors: false,
            noSelect: true,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when palette opened, expanded and closed without selection', () => {
      clickToolbarButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'closed',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            isShowingMoreColors: true,
            noSelect: true,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when show more colors clicked', () => {
      clickToolbarButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'opened',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            showLessButton: false,
            showMoreButton: true,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when palette opened, expanded, closed without selection and stay expanded when re-opened', () => {
      clickToolbarButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);
      clickToolbarButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'opened',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            isShowingMoreColors: true,
            noSelect: false,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics when show less colors clicked', () => {
      clickToolbarButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'closed',
          actionSubject: 'toolbar',
          actionSubjectId: 'color',
          attributes: {
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            showLessButton: true,
            showMoreButton: false,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics event when old color selected', () => {
      const { palette } = pluginState;
      const color = getColorFromPalette(palette, 2); // Teal

      clickToolbarButton(toolbarTextColor);
      clickColor(toolbarTextColor, color);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId: 'color',
          attributes: {
            color: 'teal',
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            isNewColor: false,
            isShowingMoreColors: false,
          },
          eventType: 'track',
        }),
      );
    });

    it('should create analytics event when new color selected', () => {
      const { paletteExpanded = [] } = pluginState;
      const color = getColorFromPalette(
        paletteExpanded,
        paletteExpanded.length - 1,
      );

      if (!color) {
        throw new Error('Unable to find color');
      }

      clickToolbarButton(toolbarTextColor);
      clickTogglePaletteButton(toolbarTextColor);
      clickColor(toolbarTextColor, color);

      expect(mockDispatchAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId: 'color',
          attributes: {
            color: 'light purple',
            experiment: 'editor.toolbarTextColor.moreColors',
            experimentGroup: 'subject',
            isNewColor: true,
            isShowingMoreColors: true,
          },
          eventType: 'track',
        }),
      );
    });
  });
});
