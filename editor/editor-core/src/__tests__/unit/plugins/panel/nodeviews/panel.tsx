import { shallow, ShallowWrapper } from 'enzyme';
import {
  PanelSharedCssClassName,
  ProviderFactory,
} from '@atlaskit/editor-common';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { PanelType } from '@atlaskit/adf-schema';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { Emoji } from '@atlaskit/editor-common';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import React from 'react';
import {
  getPanelNodeView,
  panelIcons,
} from '../../../../../plugins/panel/nodeviews/panel';
import { PanelPluginOptions } from '../../../../../plugins/panel/types';
import { PanelIcon } from './../../../../../plugins/panel/nodeviews/panel';
import panelPlugin from '../../../../../plugins/panel';

jest.mock('@atlaskit/emoji/element');

describe('Panel - NodeView', () => {
  const createEditor = createProsemirrorEditorFactory();
  const renderEmojiSpy = jest.fn();
  let providerFactory: ProviderFactory;
  const emojiProvider = getTestEmojiResource();
  ((ResourcedEmoji as unknown) as jest.Mock).mockImplementation(() => {
    return {
      render: renderEmojiSpy,
    };
  });

  beforeEach(() => {
    providerFactory = ProviderFactory.create({ emojiProvider });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a contentDOM of `div` inside `div[data-panel-type]`', () => {
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    const node = panel()(p('this is the decision'))(defaultSchema);

    const providerFactory = ProviderFactory.create({});
    const panelPluginOptions: PanelPluginOptions = {};
    const nodeView = getPanelNodeView(panelPluginOptions, providerFactory)(
      node,
      editorView,
      () => -1,
    );

    const contentDOM = nodeView!.contentDOM as HTMLElement;

    expect(contentDOM.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.getAttribute('data-panel-type')).toBe(
      'info',
    );
  });

  describe('PanelIcon', () => {
    const standardPanelTypes = Object.values(PanelType).filter(
      (panelType) => panelType !== PanelType.CUSTOM,
    );
    let panelIcon: ShallowWrapper;

    afterEach(() => {
      if (panelIcon && panelIcon.length) {
        panelIcon.unmount();
      }
    });

    it.each<PanelType>(standardPanelTypes)(
      'renders panelIcon according to standard panel type %s',
      (panelType) => {
        panelIcon = shallow(
          <PanelIcon
            panelAttributes={{
              panelType: panelType,
            }}
          />,
        );
        expect(panelIcon.find(panelIcons[panelType])).toHaveLength(1);
      },
    );

    it('renders emojiIcon for custom panel type', () => {
      panelIcon = shallow(
        <PanelIcon
          allowCustomPanel={true}
          providerFactory={providerFactory}
          panelAttributes={{
            panelType: PanelType.CUSTOM,
            panelIcon: ':smiley:',
          }}
        />,
      );
      const emojiWrapper = panelIcon.find(Emoji);
      expect(emojiWrapper).toHaveLength(1);
      expect(emojiWrapper.prop('shortName')).toBe(':smiley:');
      expect(emojiWrapper.prop('showTooltip')).toBe(false);
    });
  });

  describe('custom panels', () => {
    const testDocWithPanel = doc(
      panel({
        panelType: 'custom',
        panelIcon: ':smiley:',
        panelColor: 'rgb(0, 255, 0)',
      })(p('custom panel')),
    );

    function setupEditor(allowCustomPanel: boolean = false) {
      const editorData = createEditor({
        doc: testDocWithPanel,
        preset: new Preset<LightEditorPlugin>().add([
          panelPlugin,
          {
            UNSAFE_allowCustomPanel: allowCustomPanel,
          },
        ]),
        providerFactory,
      });
      const editorView = editorData.editorView;
      const panelElement = editorView.dom.firstChild as HTMLElement;
      return { editorView, panelElement };
    }

    it('renders panel with emoji and color when feature flag enabled', () => {
      const { panelElement } = setupEditor(true);
      expect(panelElement.getAttribute('data-panel-type')).toBe('custom');

      expect(panelElement.style.backgroundColor).toEqual('rgb(0, 255, 0)');
      expect(ResourcedEmoji).toBeCalledWith(
        expect.objectContaining({
          emojiId: {
            fallback: undefined,
            id: undefined,
            shortName: ':smiley:',
          },
          emojiProvider: emojiProvider,
          fitToHeight: 20,
          showTooltip: false,
        }),
        expect.any(Object),
      );
      expect(renderEmojiSpy).toHaveBeenCalled();
    });

    it('does not render panel with emoji and color when feature flag disabled', () => {
      const { panelElement } = setupEditor();
      expect(panelElement.style.backgroundColor).toEqual('');
      expect(panelElement.getAttribute('data-panel-type')).toBe('custom');
      expect(ResourcedEmoji).not.toHaveBeenCalled();
    });

    it('renders panel icon as NOT content-editable element', () => {
      const { panelElement } = setupEditor(true);
      expect(
        (panelElement.querySelector(
          `.${PanelSharedCssClassName.icon}`,
        ) as HTMLElement).contentEditable,
      ).toEqual('false');
    });
  });

  describe('mutation', () => {
    it(`should ignore mutations inside panel nodeview`, () => {
      const { editorView } = createEditor({
        doc: doc(p()),
      });

      const node = panel()(p('this is the decision'))(defaultSchema);

      const providerFactory = ProviderFactory.create({});
      const panelPluginOptions: PanelPluginOptions = {};
      const nodeView = getPanelNodeView(panelPluginOptions, providerFactory)(
        node,
        editorView,
        () => -1,
      );

      const mutation: MutationRecord = {
        target: nodeView.icon,
      } as any;

      expect(nodeView.ignoreMutation!(mutation)).toBe(true);
    });
  });
});
