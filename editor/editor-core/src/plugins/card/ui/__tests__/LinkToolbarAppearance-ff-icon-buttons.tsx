import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { fakeIntl } from '@atlaskit/media-test-helpers';
import {
  doc,
  p,
  inlineCard,
  blockCard,
  ul,
  li,
  a,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import { pluginKey } from '../../pm-plugins/main';
import {
  LinkToolbarAppearance,
  LinkToolbarAppearanceProps,
} from '../LinkToolbarAppearance';
import {
  cardContext,
  MockCardContextAdapter,
  mockCardContextState,
  mockPreview,
} from './_utils/mock-card-context';
import userEvent from '@testing-library/user-event';

describe('LinkToolbarAppearance', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        featureFlags: {
          'view-changing-experiment-toolbar-style': 'toolbarIcons',
        },
        allowPanel: true,
        smartLinks: {
          allowEmbeds: true,
        },
      },
      pluginKey,
    });
  };

  const defaultCardAttributes = {
    url: 'http://www.atlassian.com/',
    localId: 'cool-be4nz-rand0m-return',
  };

  const setup = (
    props?: Partial<LinkToolbarAppearanceProps>,
    builder?: DocBuilder[],
  ) => {
    const defaultBuilder = () => [
      p('{<node>}', inlineCard(defaultCardAttributes)()),
    ];

    const content = builder ?? defaultBuilder();
    const { editorView } = editor(doc(panel()(...content)));

    render(
      <MockCardContextAdapter card={cardContext}>
        <LinkToolbarAppearance
          intl={fakeIntl}
          editorState={editorView.state}
          editorView={editorView}
          currentAppearance="inline"
          url="some-url"
          {...props}
        />
      </MockCardContextAdapter>,
    );

    return {
      toolbar,
      editorView,
    };
  };

  const translated = (text: string) => `fakeIntl["${text}"]`;

  const queryForButtonByLabel = (label: string) => {
    return screen.queryByRole('button', {
      name: translated(label),
      hidden: true,
    });
  };

  beforeEach(() => {
    mockPreview();
    mockCardContextState();
  });

  describe('when featureFlag `viewChangingExperimentToolbarStyle` is `toolbarIcons`', () => {
    it('should render default options', () => {
      setup();

      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('should render `Embed` option when available', () => {
      mockPreview('some-url-preview');

      setup({
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeTruthy();
    });

    it('should not render `Embed` option by default', () => {
      setup();

      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('when `currentApperance` is `undefined`, only renders URL button as pressed', () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: undefined,
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('when `currentApperance` is `inline`, only renders Inline button as pressed', () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'inline',
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('when `currentApperance` is `block`, only renders Card button as pressed', () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'block',
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('when `currentApperance` is `embed`, only renders Embed button as pressed', () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'embed',
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should switch from `inline` to `block` appearance in the existing position on appearance change', async () => {
      const user = userEvent.setup();
      mockPreview('some-url-preview');

      const { editorView } = setup({
        currentAppearance: 'inline',
        allowEmbeds: true,
        platform: 'web',
      });

      const cardButton = queryForButtonByLabel('Card');
      await user.click(cardButton!);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(), blockCard(defaultCardAttributes)())),
      );
    });

    it('should switch from smart card into `hyperlink` when clicking on the `URL` button', async () => {
      const user = userEvent.setup();
      mockPreview('some-url-preview');

      const url = 'some-url';

      const { editorView } = setup({
        url,
        currentAppearance: 'inline',
      });

      const button = queryForButtonByLabel('URL');
      await user.click(button!);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(a({ href: url })(url)))),
      );
    });

    it('should return no buttons when url has fatal error', () => {
      const url = 'some-url';

      mockCardContextState({
        [url]: {
          error: {
            kind: 'fatal',
          },
        },
      });

      setup({
        url,
        currentAppearance: 'inline',
        allowEmbeds: true,
        platform: 'web',
      });

      expect(queryForButtonByLabel('URL')).toBeNull();
      expect(queryForButtonByLabel('Inline')).toBeNull();
      expect(queryForButtonByLabel('Card')).toBeNull();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('should disable appearance button if its not supported in the parent', () => {
      mockPreview('some-url-preview');

      setup(
        {
          currentAppearance: 'inline',
          allowEmbeds: true,
          platform: 'web',
        },
        [ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))],
      );

      expect(queryForButtonByLabel('URL')).not.toBeDisabled();
      expect(queryForButtonByLabel('Inline')).not.toBeDisabled();
      expect(queryForButtonByLabel('Card')).toBeDisabled();
      expect(queryForButtonByLabel('Embed')).toBeDisabled();
    });
  });
});
