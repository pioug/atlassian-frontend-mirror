import React from 'react';
import { shallow } from 'enzyme';
import { fakeIntl } from '@atlaskit/media-test-helpers';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { EditorState } from 'prosemirror-state';
import { LinkToolbarAppearance } from '../LinkToolbarAppearance';
import Dropdown from '../../../floating-toolbar/ui/Dropdown';
import {
  doc,
  p,
  inlineCard,
  blockCard,
  blockquote,
  panel as panelNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { pluginKey } from '../../pm-plugins/main';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common';

describe('LinkToolbarAppearance', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        UNSAFE_cards: {},
        allowPanel: true,
      },
      pluginKey,
    });
  };

  it('should render default options', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );

    expect(toolbar.find(Dropdown)).toHaveLength(1);
    expect(toolbar.find(Dropdown).prop('options')).toHaveLength(2);
  });

  it('should render embed option when available', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
        allowEmbeds
        platform="web"
      />,
    );
    const getPreview = jest.fn().mockReturnValue('some-url-preview');
    const context = {
      contextAdapter: {
        card: {
          value: {
            extractors: { getPreview },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    expect(getPreview).toBeCalledWith('some-url', 'web');
    expect(toolbar.find(Dropdown)).toHaveLength(1);
    expect(toolbar.find(Dropdown).prop('options')).toHaveLength(3);
  });

  it('should not render embed option by default', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );
    const getPreview = jest.fn();
    const context = {
      contextAdapter: {
        card: {
          value: {
            extractors: { getPreview },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    expect(getPreview).not.toBeCalled();
    expect(toolbar.find(Dropdown)).toHaveLength(1);
    expect(toolbar.find(Dropdown).prop('options')).toHaveLength(2);
  });

  it('should render selected option', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );

    expect(
      (toolbar.find(Dropdown).prop('options') as any)[1].selected,
    ).toBeTruthy();

    toolbar.setProps({
      currentAppearance: 'inline',
    });

    expect(
      (toolbar.find(Dropdown).prop('options') as any)[0].selected,
    ).toBeTruthy();
  });

  it('dropdown is disabled when inside parent nodes which dont support block cards', () => {
    const { editorView } = editor(
      doc(
        p('paragraph'),
        blockquote(
          p(
            '{<node>}',
            inlineCard({
              url:
                'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing',
            })(),
          ),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const dropdown = toolbar.find(Dropdown);
    expect(dropdown.prop('disabled')).toBeTruthy();
  });

  it('it switches appearance on dropdown option click', () => {
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const dropdown = toolbar.find(Dropdown);

    (dropdown.prop('options') as any)[1].onClick(
      editorView.state,
      editorView.dispatch,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        blockCard({
          url: 'http://www.atlassian.com/',
        })(),
        p(),
      ),
    );
  });

  it('switches to block appearance in the existing position on appearance change', () => {
    const { editorView } = editor(
      doc(
        panelNode()(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const dropdown = toolbar.find(Dropdown);

    (dropdown.prop('options') as any)[1].onClick(
      editorView.state,
      editorView.dispatch,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        panelNode()(
          p(),
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
          p(),
        ),
      ),
    );
  });
});
