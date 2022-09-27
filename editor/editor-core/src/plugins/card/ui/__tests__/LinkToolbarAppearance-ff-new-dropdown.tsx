import React from 'react';

import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';

import { fakeIntl } from '@atlaskit/media-test-helpers';
import {
  a,
  blockCard,
  doc,
  DocBuilder,
  inlineCard,
  li,
  p,
  panel,
  ul,
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
  let user: ReturnType<typeof userEvent.setup>;

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        featureFlags: {
          'view-changing-experiment-toolbar-style': 'newDropdown',
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
    return screen.queryByRole('option', {
      name: translated(label),
      hidden: true,
    });
  };

  const clickDropdownTrigger = async () => {
    const dropdownButton = screen.queryByTestId(
      'link-toolbar-appearance-button',
    );
    await user.click(dropdownButton!);
  };

  beforeEach(() => {
    mockPreview();
    mockCardContextState();
    user = userEvent.setup();
  });

  describe('when featureFlag `viewChangingExperimentToolbarStyle` is `newDropdown`', () => {
    it('should render default options', async () => {
      setup();
      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('should render `Embed` option when available', async () => {
      mockPreview('some-url-preview');

      setup({
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeTruthy();
    });

    it('should not render `Embed` option by default', async () => {
      setup();

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('when `currentApperance` is `undefined`, only renders URL button as selected', async () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: undefined,
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('when `currentApperance` is `inline`, only renders Inline button as selected', async () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'inline',
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('when `currentApperance` is `block`, only renders Card button as selected', async () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'block',
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('when `currentApperance` is `embed`, only renders Embed button as selected', async () => {
      mockPreview('some-url-preview');

      setup({
        currentAppearance: 'embed',
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('should switch from `inline` to `block` appearance in the existing position on appearance change', async () => {
      mockPreview('some-url-preview');

      const { editorView } = setup({
        currentAppearance: 'inline',
        allowEmbeds: true,
        platform: 'web',
      });

      await clickDropdownTrigger();
      const cardButton = queryForButtonByLabel('Card');
      await user.click(cardButton!);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(), blockCard(defaultCardAttributes)())),
      );
    });

    it('should switch from smart card into `hyperlink` when clicking on the `URL` button', async () => {
      mockPreview('some-url-preview');

      const url = 'some-url';

      const { editorView } = setup({
        url,
        currentAppearance: 'inline',
      });

      await clickDropdownTrigger();
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

      const dropdownButton = screen.queryByTestId(
        'link-toolbar-appearance-button',
      );
      expect(dropdownButton).toBeNull();
    });

    it('should disable appearance button if its not supported in the parent', async () => {
      mockPreview('some-url-preview');

      setup(
        {
          currentAppearance: 'inline',
          allowEmbeds: true,
          platform: 'web',
        },
        [ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))],
      );

      await clickDropdownTrigger();
      expect(queryForButtonByLabel('URL')).toHaveAttribute(
        'aria-disabled',
        'false',
      );
      expect(queryForButtonByLabel('Inline')).toHaveAttribute(
        'aria-disabled',
        'false',
      );
      expect(queryForButtonByLabel('Card')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(queryForButtonByLabel('Embed')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('should be able to select a dropdown option with enter key', async () => {
      const url = 'some-url';

      const { editorView } = setup({
        url,
        currentAppearance: 'inline',
      });

      await clickDropdownTrigger();

      // Floating toolbar dropdown trigger does not receive focus by default.
      screen.queryByTestId('link-toolbar-appearance-button')?.focus();
      await user.tab();
      const urlButton = queryForButtonByLabel('URL');
      expect(urlButton).toHaveFocus();
      fireEvent.keyDown(urlButton!, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(a({ href: url })(url)))),
      );
    });

    it('should not be able to select a disabled dropdown option with enter key', async () => {
      mockPreview('some-url-preview');

      const { editorView } = setup(
        {
          currentAppearance: 'inline',
          allowEmbeds: true,
          platform: 'web',
        },
        [ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))],
      );

      await clickDropdownTrigger();

      // Floating toolbar dropdown trigger does not receive focus by default.
      screen.queryByTestId('link-toolbar-appearance-button')?.focus();
      const cardButton = queryForButtonByLabel('Card');
      await user.tab();
      await user.tab(); // :)
      await user.tab();
      expect(cardButton).toHaveFocus();
      fireEvent.keyDown(cardButton!, {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          panel()(ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))),
        ),
      );
    });

    it('should be able to select a dropdown option with spacebar', async () => {
      const url = 'some-url';

      const { editorView } = setup({
        url,
        currentAppearance: 'inline',
      });

      await clickDropdownTrigger();

      // Floating toolbar dropdown trigger does not receive focus by default
      screen.queryByTestId('link-toolbar-appearance-button')?.focus();
      await user.tab();
      const urlButton = queryForButtonByLabel('URL');
      expect(urlButton).toHaveFocus();
      fireEvent.keyDown(urlButton!, {
        key: 'Space',
        code: 'Space',
        charCode: 32,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(a({ href: url })(url)))),
      );
    });

    it('should not be able to select a disabled dropdown option with spacebar', async () => {
      mockPreview('some-url-preview');

      const { editorView } = setup(
        {
          currentAppearance: 'inline',
          allowEmbeds: true,
          platform: 'web',
        },
        [ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))],
      );

      await clickDropdownTrigger();

      // Floating toolbar dropdown trigger does not receive focus by default.
      screen.queryByTestId('link-toolbar-appearance-button')?.focus();
      const cardButton = queryForButtonByLabel('Card');
      await user.tab();
      await user.tab(); // :)
      await user.tab();
      expect(cardButton).toHaveFocus();
      fireEvent.keyDown(cardButton!, {
        key: 'Space',
        code: 'Space',
        charCode: 32,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          panel()(ul(li(p('{<node>}', inlineCard(defaultCardAttributes)())))),
        ),
      );
    });
  });
});
