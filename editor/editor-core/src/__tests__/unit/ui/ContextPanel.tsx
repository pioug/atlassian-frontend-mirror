import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import ContextPanel, {
  Content,
  Panel,
  SwappableContentArea,
} from '../../../ui/ContextPanel';
import EditorContext from '../../../ui/EditorContext';

import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorFullWidthLayoutLineLength,
} from '@atlaskit/editor-shared-styles';
import { EditorPlugin } from '../../../types';
import { EventDispatcher } from '../../../event-dispatcher';
import EditorActions from '../../../actions';
import contextPanelPlugin from '../../../plugins/context-panel';
import {
  ContextPanelConsumer,
  ContextPanelWidthProvider,
} from '../../../ui/ContextPanel/context';

import {
  isPushingEditorContent,
  editorWithWideBreakoutAndSidebarWidth,
} from '../../__helpers/page-objects/_context-panel';

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
      const panel = wrapper.find(Panel);
      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('320px');
    });

    it('hides content when visible is false', () => {
      wrapper = mount(
        <SwappableContentArea visible={false}></SwappableContentArea>,
      );
      const panel = wrapper.find(Panel);
      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('0px');
    });

    it('clips content using the container', () => {
      wrapper = mount(<SwappableContentArea visible />);
      const style = getComputedStyle(wrapper.find(Panel).getDOMNode());
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
      const panelElement = wrapper.find(Panel).getDOMNode();
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
      const panelElement = wrapper.find(Panel).getDOMNode();
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
      const panelElement = wrapper.find(Panel).getDOMNode();
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
      const panelElement = wrapper.find(Panel).getDOMNode();
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
      const panelElement = wrapper.find(Panel).getDOMNode();
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
      const panelElement = wrapper.find(Panel).getDOMNode();
      expect(isPushingEditorContent(panelElement)).toBeTruthy();
    });
  });
  describe('content', () => {
    it('is scrollable up/down', () => {
      wrapper = mount(<SwappableContentArea visible />);
      const style = getComputedStyle(wrapper.find(Content).getDOMNode());
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
      editorPlugins: [mockContextPanelPlugin, contextPanelPlugin()],
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
});
