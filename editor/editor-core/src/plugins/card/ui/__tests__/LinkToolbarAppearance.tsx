jest.mock('../../pm-plugins/doc', () => {
  const doc = jest.requireActual('../../pm-plugins/doc');
  return {
    ...doc,
    changeSelectedCardToLink: jest.fn().mockReturnValue(() => () => {}),
  };
});
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
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
import { changeSelectedCardToLink } from '../../pm-plugins/doc';

describe('LinkToolbarAppearance', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        UNSAFE_cards: {},
      },
      pluginKey,
    });
  };
  const getDropdownOptions = (toolbar: ShallowWrapper) => {
    const dropdown = toolbar.find(Dropdown);
    const options = (dropdown.prop('options') as unknown) as {
      testId: string;
      onClick: (state: EditorState, dispath: Function) => void;
      selected: boolean;
    }[];

    return options;
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
    const dropdown = toolbar.find(Dropdown);

    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
    ]);
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
    const dropdown = toolbar.find(Dropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
      expect.objectContaining({ testId: 'embed-appearance' }),
    ]);
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
    const dropdown = toolbar.find(Dropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
    ]);
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

    expect(toolbar.find(Dropdown).prop('options')).toContainEqual(
      expect.objectContaining({
        testId: 'block-appearance',
        selected: true,
      }),
    );

    toolbar.setProps({
      currentAppearance: 'inline',
    });

    expect(toolbar.find(Dropdown).prop('options')).toContainEqual(
      expect.objectContaining({
        testId: 'inline-appearance',
        selected: true,
      }),
    );
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
    const options = getDropdownOptions(toolbar);

    options
      .find(option => option.testId === 'block-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        blockCard({
          url: 'http://www.atlassian.com/',
        })(),
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
    const options = getDropdownOptions(toolbar);
    options
      .find(option => option.testId === 'block-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        panelNode()(
          p(),
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );
  });

  it('should switch smart card into link when clicking on "Display URL"', () => {
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
    const options = getDropdownOptions(toolbar);
    options
      .find(option => option.testId === 'url-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(changeSelectedCardToLink).toBeCalledTimes(1);
    expect(changeSelectedCardToLink).toBeCalledWith(
      'some-url',
      'some-url',
      true,
    );
  });

  it('should render URL appearance as selected if no currentAppearance is provided', () => {
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
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const options = getDropdownOptions(toolbar);
    const urlAppearance = options.find(
      option => option.testId === 'url-appearance',
    );
    expect(urlAppearance!.selected).toBeTruthy();
  });
});
