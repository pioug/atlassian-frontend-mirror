import React from 'react';
// eslint-disable-next-line
import { mount, ReactWrapper } from 'enzyme';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import ContextPanel, {
  shouldPanelBePositionedOverEditor,
  SwappableContentArea,
} from '../../../ui/ContextPanel';
import EditorContext from '../../../ui/EditorContext';

import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorFullWidthLayoutLineLength,
} from '@atlaskit/editor-shared-styles';
import type { EditorPlugin } from '../../../types';
import { EventDispatcher } from '../../../event-dispatcher';
import EditorActions from '../../../actions';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import {
  ContextPanelConsumer,
  ContextPanelWidthProvider,
} from '@atlaskit/editor-common/ui';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  isPushingEditorContent,
  editorWithWideBreakoutAndSidebarWidth,
} from '@atlaskit/editor-test-helpers/page-objects/context-panel';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const panelSelector = 'div[data-testid="context-panel-panel"]';

describe('SwappableContentArea', () => {
  const Component: React.FC = jest.fn(() => null);
  let wrapper: ReactWrapper | undefined;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
  });

  it('renders children', () => {
    wrapper = mount(
      <SwappableContentArea visible>
        <Component></Component>
      </SwappableContentArea>,
    );
    expect(wrapper.find(Component).length).toBe(1);
  });

  // ContextPanel animates by doing a CSS transition on the container's width,
  // and inside the container, sliding the content off screen.
  //
  // The container clips content to avoid scroll and overlaying with any elements
  // that might be on the right.

  describe('container', () => {
    it('displays content when visible is true', () => {
      wrapper = mount(<SwappableContentArea visible></SwappableContentArea>);
      const panel = wrapper.find(panelSelector);

      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('320px');
    });

    it('hides content when visible is false', () => {
      wrapper = mount(
        <SwappableContentArea visible={false}></SwappableContentArea>,
      );
      const panel = wrapper.find(panelSelector);
      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('0px');
    });

    it('clips content using the container', () => {
      wrapper = mount(<SwappableContentArea visible />);
      const style = getComputedStyle(wrapper.find(panelSelector).getDOMNode());
      expect(style.overflow).toEqual('hidden');
    });

    it('should push the editor content if it will overlap the editor', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: akEditorDefaultLayoutWidth,
            containerWidth: akEditorDefaultLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: [],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeTruthy();
    });

    it('should not push the editor content if it will not overlap the editor', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: akEditorFullWidthLayoutWidth,
            containerWidth: akEditorFullWidthLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: [],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeFalsy();
    });

    it('should push the editor content if there are full-width editor breakout content', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: akEditorFullWidthLayoutWidth,
            containerWidth: akEditorFullWidthLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: ['full-width'],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeTruthy();
    });

    it('should not push the editor content if there are wide breakout editor content but panel will not overlap the editor', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: akEditorFullWidthLayoutWidth,
            containerWidth: akEditorFullWidthLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: ['wide'],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeFalsy();
    });

    it('should push the editor cotent if there are wide breakout editor content and panel will overlap the editor', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: editorWithWideBreakoutAndSidebarWidth,
            containerWidth: editorWithWideBreakoutAndSidebarWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: ['wide'],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeTruthy();
    });

    it('should push the content if editor is in full width mode', () => {
      wrapper = mount(
        <SwappableContentArea
          visible
          editorWidth={{
            width: akEditorFullWidthLayoutWidth,
            containerWidth: akEditorFullWidthLayoutWidth,
            lineLength: akEditorFullWidthLayoutLineLength,
            contentBreakoutModes: [],
          }}
        />,
      );
      const panelElement = wrapper.find(panelSelector).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeTruthy();
    });
  });
  describe('content', () => {
    it('is scrollable up/down', () => {
      wrapper = mount(<SwappableContentArea visible />);
      const style = getComputedStyle(
        wrapper.find('div[data-testid="context-panel-content"]').getDOMNode(),
      );
      expect(style.overflowY).toEqual('auto');
    });
  });
});

describe('ContextPanelWidthProvider', () => {
  let wrapper: ReactWrapper | undefined;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
  });
  it('should broadcast width', () => {
    let broadCast: (wdith: number) => void = (width) => {};
    wrapper = mount(
      <ContextPanelWidthProvider>
        <ContextPanelConsumer>
          {({ width, broadcastWidth }) => {
            broadCast = broadcastWidth;
            return <div>{width}</div>;
          }}
        </ContextPanelConsumer>
      </ContextPanelWidthProvider>,
    );
    broadCast(320);
    wrapper.update();
    expect(wrapper.text()).toBe('320');
  });

  it('should broadcast positionedOverEditor', () => {
    let broadCast: (positionedOverEditor: boolean) => void = (
      positionedOverEditor,
    ) => {};
    wrapper = mount(
      <ContextPanelWidthProvider>
        <ContextPanelConsumer>
          {({ positionedOverEditor, broadcastPosition }) => {
            broadCast = broadcastPosition;
            return <div>{positionedOverEditor ? 'true' : 'false'}</div>;
          }}
        </ContextPanelConsumer>
      </ContextPanelWidthProvider>,
    );
    broadCast(true);
    wrapper.update();
    expect(wrapper.text()).toBe('true');
  });

  it('should broadcast width with SwappableContentArea', () => {
    wrapper = mount(
      <ContextPanelWidthProvider>
        <SwappableContentArea visible>
          <ContextPanelConsumer>
            {({ width }) => {
              return <div>{width}</div>;
            }}
          </ContextPanelConsumer>
        </SwappableContentArea>
      </ContextPanelWidthProvider>,
    );
    expect(wrapper.text()).toBe('320');
  });

  it('should broadcast positionOverEditor to be true if panel is not pushing Editor', () => {
    wrapper = mount(
      <ContextPanelWidthProvider>
        <SwappableContentArea
          editorWidth={{
            width: akEditorFullWidthLayoutWidth,
            containerWidth: akEditorFullWidthLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: [],
          }}
          visible
        >
          <ContextPanelConsumer>
            {({ positionedOverEditor }) => {
              return <div>{positionedOverEditor ? 'true' : 'false'}</div>;
            }}
          </ContextPanelConsumer>
        </SwappableContentArea>
      </ContextPanelWidthProvider>,
    );
    expect(wrapper.text()).toBe('true');
  });

  it('should broadcast positionOverEditor to be false if panel is pushing Editor', () => {
    wrapper = mount(
      <ContextPanelWidthProvider>
        <SwappableContentArea
          editorWidth={{
            width: akEditorDefaultLayoutWidth,
            containerWidth: akEditorDefaultLayoutWidth,
            lineLength: akEditorDefaultLayoutWidth,
            contentBreakoutModes: [],
          }}
          visible
        >
          <ContextPanelConsumer>
            {({ positionedOverEditor }) => {
              return <div>{positionedOverEditor ? 'true' : 'false'}</div>;
            }}
          </ContextPanelConsumer>
        </SwappableContentArea>
      </ContextPanelWidthProvider>,
    );
    expect(wrapper.text()).toBe('false');
  });
});

//ContextPanel uses WithEditorActions
const mountWithContext = (node: React.ReactNode, actions?: EditorActions) =>
  mount(<EditorContext editorActions={actions}>{node}</EditorContext>);

const editorFactory = createEditorFactory();

const mockContextPanelPlugin: EditorPlugin = {
  name: 'mockContextPanelPlugin',
  pluginsOptions: {
    contextPanel: (state) => <p>mario saxaphone</p>,
  },
};

describe('ContextPanel', () => {
  let wrapper: ReactWrapper | undefined;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
  });

  it('renders SwappableContentArea', () => {
    wrapper = mountWithContext(
      <ContextPanel visible={true}>
        <div>yoshi bongo</div>
      </ContextPanel>,
    );
    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea).toBeDefined();
  });

  it('passes top-level props and children to SwappableContentArea', () => {
    wrapper = mountWithContext(
      <ContextPanel visible={true}>
        <div>yoshi bongo</div>
      </ContextPanel>,
    );
    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea.prop('visible')).toBe(true);
    expect(wrapper.text().indexOf('yoshi bongo')).toBeGreaterThan(-1);
  });

  it('provides no pluginContent if no EventDispatcher', () => {
    wrapper = mountWithContext(
      <ContextPanel visible={true}>
        <div>yoshi bongo</div>
      </ContextPanel>,
    );
    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea.prop('pluginContent')).toBeUndefined();
  });

  it('provides no pluginContent if no plugins define content', () => {
    const editor = editorFactory({ doc: doc(p('hello')) });
    const editorActions = new EditorActions();
    const eventDispatcher = new EventDispatcher();

    editorActions._privateRegisterEditor(editor.editorView, eventDispatcher);
    wrapper = mountWithContext(
      <ContextPanel visible={true}>
        <div>yoshi bongo</div>
      </ContextPanel>,
      editorActions,
    );

    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea.prop('pluginContent')).toBeUndefined();
  });

  it('uses pluginContent instead if plugins define content', () => {
    const editor = editorFactory({
      editorPlugins: [
        mockContextPanelPlugin,
        contextPanelPlugin({ config: undefined }),
      ],
      doc: doc(p('hello')),
    });
    const editorActions = new EditorActions();
    const eventDispatcher = new EventDispatcher();

    editorActions._privateRegisterEditor(editor.editorView, eventDispatcher);
    wrapper = mountWithContext(
      <ContextPanel visible={true}>
        <div>yoshi bongo</div>
      </ContextPanel>,
      editorActions,
    );

    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea.prop('pluginContent')).toBeDefined();
    expect(wrapper.text().indexOf('yoshi bongo')).toEqual(-1);
    expect(wrapper.text().indexOf('mario saxaphone')).toBeGreaterThan(-1);
  });

  it('should focus editor on ESC from the sidebar config panel', async () => {
    const { editorView } = editorFactory({
      editorPlugins: [contextPanelPlugin({ config: undefined })],
      doc: doc(p('hello')),
    });
    const editorActions = new EditorActions();
    const eventDispatcher = new EventDispatcher();

    editorActions._privateRegisterEditor(editorView, eventDispatcher);

    const mountContextPanelWithContext = (actions?: EditorActions) =>
      mount(
        React.createElement(
          (props) => (
            <EditorContext editorActions={actions}>
              <ContextPanel {...props}>
                <div>yoshi bongo</div>
              </ContextPanel>
            </EditorContext>
          ),
          { visible: true },
        ),
      );
    const wrapper = mountContextPanelWithContext(editorActions);

    const editorFocusSpy = jest.spyOn(editorView, 'focus');

    await wrapper.setProps({ visible: false });

    wrapper.update();

    await expect(editorFocusSpy).toHaveBeenCalled();
  });
});

describe('shouldPanelBePositionedOverEditor', () => {
  const docCustomTableWidthEnabled = doc(
    table({ localId: 'local-id', layout: 'default', width: 1800 })(
      tr(thEmpty, thEmpty, thEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  );
  const docCustomTableWidthDisabled = doc(
    table({ localId: 'local-id', layout: 'full-width' })(
      tr(thEmpty, thEmpty, thEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  );

  const contextPanelWidth = 320;

  ffTest(
    'platform.editor.custom-table-width',
    () => {
      const editorTableWidthEnabled = editorFactory({
        doc: docCustomTableWidthEnabled,
        editorProps: {
          allowTables: true,
        },
      });
      const { editorView: view } = editorTableWidthEnabled;
      const editorWidthEnabled = {
        width: 1920,
        containerWidth: 1920,
        contentBreakoutModes: [],
      };
      const result = shouldPanelBePositionedOverEditor(
        editorWidthEnabled,
        contextPanelWidth,
        view,
      );
      expect(result).toBeFalsy();
    },
    () => {
      const editorTableWidthDisabled = editorFactory({
        doc: docCustomTableWidthDisabled,
        editorProps: {
          allowTables: true,
        },
      });
      const { editorView: view } = editorTableWidthDisabled;
      const editorWidthDisabled = {
        width: 1920,
        containerWidth: 1920,
        contentBreakoutModes: ['full-width'] as ('full-width' | 'wide')[],
      };
      const result = shouldPanelBePositionedOverEditor(
        editorWidthDisabled,
        contextPanelWidth,
        view,
      );
      expect(result).toBeFalsy();
    },
  );
});
