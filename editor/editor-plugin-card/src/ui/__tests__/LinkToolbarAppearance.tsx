import React from 'react';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  a,
  blockCard,
  doc,
  inlineCard,
  li,
  p,
  panel,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { fakeIntl } from '@atlaskit/media-test-helpers';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { hideLinkToolbar } from '../../pm-plugins/actions';
import {
  changeSelectedCardToLink,
  queueCardsFromChangedTr,
  setSelectedCardAppearance,
} from '../../pm-plugins/doc';
import { pluginKey } from '../../pm-plugins/main';
import type { LinkToolbarAppearanceProps } from '../LinkToolbarAppearance';
import { LinkToolbarAppearance } from '../LinkToolbarAppearance';

import {
  cardContext,
  MockCardContextAdapter,
  mockCardContextState,
  mockPreview,
} from './_utils/mock-card-context';

jest.mock('@atlaskit/platform-feature-flags', () => ({
  getBooleanFF: jest.fn().mockImplementation(() => false),
}));

const cardActions = {
  queueCardsFromChangedTr,
  changeSelectedCardToLink,
  setSelectedCardAppearance,
  hideLinkToolbar,
};

describe('LinkToolbarAppearance', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
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
    const { editorView } = editor(doc(...content));

    const { findByTestId } = render(
      <MockCardContextAdapter card={cardContext}>
        <LinkToolbarAppearance
          intl={fakeIntl}
          editorState={editorView.state}
          editorView={editorView}
          currentAppearance="inline"
          url="some-url"
          editorAnalyticsApi={undefined}
          cardActions={cardActions}
          {...props}
        />
      </MockCardContextAdapter>,
    );

    return {
      toolbar,
      editorView,
      findByTestId,
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

  afterEach(() => {
    (getBooleanFF as jest.Mock).mockReset();
  });

  describe('when icons toolbar appear`', () => {
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

    it('should not render `Card` option when "allowBlockCards" prop is set to false', () => {
      mockPreview('some-url-preview');
      setup({
        allowBlockCards: false,
        allowEmbeds: true,
        platform: 'web',
      });
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeNull();
      expect(queryForButtonByLabel('Embed')).toBeTruthy();
    });

    it('should not render `Embed` option when "allowEmbed" prop is set to false', () => {
      mockPreview('some-url-preview');
      setup({
        allowEmbeds: false,
        platform: 'web',
      });
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeTruthy();
      expect(queryForButtonByLabel('Embed')).toBeNull();
    });

    it('should render `Inline` and `URL` options only when "allowEmbed" & "allowBlockCards" props are set to false', () => {
      mockPreview('some-url-preview');
      setup({
        allowEmbeds: false,
        allowBlockCards: false,
        platform: 'web',
      });
      expect(queryForButtonByLabel('URL')).toBeTruthy();
      expect(queryForButtonByLabel('Inline')).toBeTruthy();
      expect(queryForButtonByLabel('Card')).toBeNull();
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

      const { editorView } = setup(
        {
          currentAppearance: 'inline',
          allowEmbeds: true,
          platform: 'web',
        },
        [panel()(blockCard(defaultCardAttributes)())],
      );

      const cardButton = queryForButtonByLabel('Card');
      await user.click(cardButton!);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(blockCard(defaultCardAttributes)())),
      );
    });

    it('should switch from smart card into `hyperlink` when clicking on the `URL` button', async () => {
      const user = userEvent.setup();
      mockPreview('some-url-preview');

      const url = 'some-url';

      const { editorView } = setup(
        {
          url,
          currentAppearance: 'inline',
        },
        [panel()(blockCard(defaultCardAttributes)())],
      );

      const button = queryForButtonByLabel('URL');
      await user.click(button!);

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p(a({ href: url })(url)))),
      );
    });

    it('should show pulse animation when embed is enabled, status is resolved, appearance is inline, and showInlineUpgradeDiscoverability is true', async () => {
      const url = 'some-url';

      (getBooleanFF as jest.Mock).mockImplementation(
        name => name === 'platform.linking-platform.smart-card.inline-switcher',
      );
      mockPreview('some-url-preview');
      mockCardContextState({
        [url]: {
          status: 'resolved',
          details: {},
        },
      });

      const { findByTestId } = setup(
        {
          url,
          allowEmbeds: true,
          platform: 'web',
          currentAppearance: 'inline',
          showInlineUpgradeDiscoverability: true,
        },
        [p('{<node>}', inlineCard(defaultCardAttributes)())],
      );

      const discoveryPulse = await findByTestId('discovery-pulse');
      expect(discoveryPulse).toBeInTheDocument();
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
