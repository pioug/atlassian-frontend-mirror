import React from 'react';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import type { DocBuilder } from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockCard,
  doc,
  embedCard,
  inlineCard,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { fakeIntl } from '@atlaskit/media-test-helpers';

import { pluginKey } from '../../pm-plugins/main';
import type { EditDatasourceButtonProps } from '../EditDatasourceButton';
import { EditDatasourceButton } from '../EditDatasourceButton';

import {
  cardContext,
  MockCardContextAdapter,
  mockCardContextState,
  mockFetchData,
} from './_utils/mock-card-context';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual('@atlaskit/editor-common/utils'),
  canRenderDatasource: jest.fn(),
}));

const mockJiraDatasourceResponse = {
  datasources: [
    {
      description: 'For extracting a list of Jira issues using JQL',
      id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
      key: 'datasource-jira-issues',
      name: 'Jira issues',
    },
  ],
};

describe('EditDatasourceButton', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        smartLinks: {
          allowEmbeds: true,
          allowDatasource: true,
        },
      },
      pluginKey,
    });
  };

  const jqlLink =
    'https://a4t-moro.jira-dev.com/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC';
  const nonJqlLink = 'http://www.atlassian.com/';

  const getCardAttributes = (isJqlLink: boolean) => {
    return {
      url: isJqlLink ? jqlLink : nonJqlLink,
    };
  };

  const setup = (
    isJqlLink: boolean,
    cardType: 'inline' | 'block' | 'embed',
    props?: Partial<EditDatasourceButtonProps>,
  ) => {
    const cardAttributes = getCardAttributes(isJqlLink);
    const cardRefNodes = {
      inline: inlineCard(cardAttributes)(),
      block: blockCard(cardAttributes)(),
      embed: embedCard({ ...cardAttributes, layout: 'center' })(),
    };
    const cardRefNode = cardRefNodes[cardType];
    const inlineBuilder = () => [p('{<node>}', cardRefNode)];
    const blockBuilder = () => ['{<node>}', cardRefNode];
    const embedBuilder = () => ['{<node>}', cardRefNode];

    const contents = {
      inline: inlineBuilder(),
      block: blockBuilder(),
      embed: embedBuilder(),
    };
    const content = contents[cardType];
    const { editorView } = editor(doc(...content));

    render(
      <MockCardContextAdapter card={cardContext}>
        <EditDatasourceButton
          intl={fakeIntl}
          editorAnalyticsApi={undefined}
          url={isJqlLink ? jqlLink : nonJqlLink}
          editorView={editorView}
          editorState={editorView.state}
          {...props}
        />
      </MockCardContextAdapter>,
    );

    return {
      toolbar,
      editorView,
    };
  };

  beforeEach(() => {
    mockCardContextState();
    (canRenderDatasource as jest.Mock).mockReturnValue(true);
  });

  describe.each<'inline' | 'block' | 'embed'>(['inline', 'block', 'embed'])(
    '%s card',
    cardType => {
      it('should show edit button for a JQL link that can resolve into a datasource', async () => {
        mockFetchData(mockJiraDatasourceResponse);
        const { toolbar } = setup(true, cardType);
        await toolbar;
        const button = screen.getByTestId('card-edit-datasource-button');
        expect(button).toBeTruthy();
      });

      it('should not show edit button for a JQL link that can resolve into a datasource but FF is off for that type of datasource', async () => {
        (canRenderDatasource as jest.Mock).mockReturnValue(false);
        mockFetchData(mockJiraDatasourceResponse);
        const { toolbar } = setup(true, cardType);
        await toolbar;
        const button = screen.queryByTestId('card-edit-datasource-button');
        expect(button).toBeNull();
      });

      it('should not show edit button for a link that cannot resolve into a datasource', async () => {
        mockFetchData({});
        const { toolbar } = setup(false, cardType);
        await toolbar;
        expect(screen.queryByTestId('card-edit-datasource-button')).toBeNull();
      });

      it('should not show edit button when url has fatal error', async () => {
        mockFetchData(mockJiraDatasourceResponse);
        const url = 'some-url';
        mockCardContextState({
          [url]: {
            error: {
              kind: 'fatal',
            },
          },
        });

        const { toolbar } = setup(false, cardType, { url });
        await toolbar;
        expect(screen.queryByTestId('card-edit-datasource-button')).toBeNull();
      });
    },
  );
});
