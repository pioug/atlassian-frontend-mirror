import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';

import ContextPanel, {
  Content,
  Panel,
  SwappableContentArea,
} from '../../../ui/ContextPanel';
import EditorContext from '../../../ui/EditorContext';

import { EditorPlugin } from '../../../types';
import { EventDispatcher } from '../../../event-dispatcher';
import EditorActions from '../../../actions';
import contextPanelPlugin from '../../../plugins/context-panel';

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

  it('passes through width prop', () => {
    wrapper = mount(
      <SwappableContentArea width={69} visible>
        <Component></Component>
      </SwappableContentArea>,
    );
    const panel = wrapper.find(Panel);
    const content = wrapper.find(Content);

    expect(getComputedStyle(panel.getDOMNode()).width).toEqual('69px');
    expect(getComputedStyle(content.getDOMNode()).width).toEqual('69px');
  });

  // ContextPanel animates by doing a CSS transition on the container's width,
  // and inside the container, sliding the content off screen.
  //
  // The container clips content to avoid scroll and overlaying with any elements
  // that might be on the right.

  describe('container', () => {
    it('displays content when visible is true', () => {
      wrapper = mount(
        <SwappableContentArea width={69} visible></SwappableContentArea>,
      );
      const panel = wrapper.find(Panel);
      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('69px');
    });

    it('hides content when visible is false', () => {
      wrapper = mount(
        <SwappableContentArea
          width={69}
          visible={false}
        ></SwappableContentArea>,
      );
      const panel = wrapper.find(Panel);
      expect(getComputedStyle(panel.getDOMNode()).width).toEqual('0px');
    });

    it('clips content using the container', () => {
      wrapper = mount(<SwappableContentArea visible />);
      const style = getComputedStyle(wrapper.find(Panel).getDOMNode());
      expect(style.overflow).toEqual('hidden');
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

// ContextPanel uses WithEditorActions
const mountWithContext = (node: React.ReactNode, actions?: EditorActions) =>
  mount(<EditorContext editorActions={actions}>{node}</EditorContext>);

const editorFactory = createEditorFactory();

const mockContextPanelPlugin: EditorPlugin = {
  name: 'mockContextPanelPlugin',
  pluginsOptions: {
    contextPanel: state => <p>mario saxaphone</p>,
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
      <ContextPanel visible={true} width={420}>
        <div>yoshi bongo</div>
      </ContextPanel>,
    );
    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea).toBeDefined();
  });

  it('passes top-level props and children to SwappableContentArea', () => {
    wrapper = mountWithContext(
      <ContextPanel visible={true} width={420}>
        <div>yoshi bongo</div>
      </ContextPanel>,
    );
    const contentArea = wrapper.find(SwappableContentArea);
    expect(contentArea.prop('visible')).toBe(true);
    expect(contentArea.prop('width')).toBe(420);
    expect(wrapper.text().indexOf('yoshi bongo')).toBeGreaterThan(-1);
  });

  it('provides no pluginContent if no EventDispatcher', () => {
    wrapper = mountWithContext(
      <ContextPanel visible={true} width={420}>
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
      <ContextPanel visible={true} width={420}>
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
      <ContextPanel visible={true} width={420}>
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
