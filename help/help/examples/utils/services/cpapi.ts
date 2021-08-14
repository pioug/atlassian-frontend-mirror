import { useState } from 'react';
import type {
  WhatsNewArticleItem,
  WhatsNewArticle,
  articleId,
} from '../../../src';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';
const CPAPI_URL =
  'https://content-platform-api.stg.services.atlassian.com/graphql';
const DEFAULT_NUMBER_OF_WHATS_NEW_ITEMS_RESULTS = 10;

export const useContentPlatformApi = () => {
  const [token, setToken] = useState('');

  const searchWhatsNewArticles = async (
    filter?: string,
    numberOfItems?: number,
    page?: string,
  ): Promise<{
    articles: WhatsNewArticleItem[];
    nextPage: string;
    hasNextPage: boolean;
  }> => {
    console.log(filter);
    console.log(numberOfItems);
    console.log(page);

    const filterByType = filter ? `filter:{changeTypes:["${filter}"]}, ` : '';
    const after = page ? `after: "${page}", ` : '';
    const first = `first: ${
      numberOfItems ? numberOfItems : DEFAULT_NUMBER_OF_WHATS_NEW_ITEMS_RESULTS
    }`;

    const graphqlRequest = JSON.stringify({
      query: `
        query {
          releaseNotes(${filterByType}${after}${first}) {
            edges {
              releaseNote: node {
                releaseNoteId
                fdIssueLink
                fdIssueKey
                title
                description
                changeStatus {label}
                changeType {label}
                relatedContexts {
                  ... on ContextProduct {
                    name: productName
                  }
                  ... on ContextApp {
                    name: appName
                  }
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }`,
    });

    try {
      const response = await fetch(CPAPI_URL, {
        method: 'POST',
        credentials: 'include',
        referrerPolicy: 'origin-when-cross-origin',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: graphqlRequest,
      });

      return formatReleaseNotesData(await response.json());
    } catch (error) {
      throw new Error(error);
    }
  };

  const formatReleaseNotesData = (
    data: any,
  ): {
    articles: WhatsNewArticleItem[];
    nextPage: string;
    hasNextPage: boolean;
  } => {
    if (data.data?.releaseNotes) {
      const releaseNotesItemsData = data.data?.releaseNotes.edges;
      const releaseNotesPageData = data.data?.releaseNotes.pageInfo;
      const releaseNotesItems: WhatsNewArticleItem[] = releaseNotesItemsData
        ? releaseNotesItemsData.map((releaseNoteItemsData: any) => {
            const { releaseNote } = releaseNoteItemsData;
            if (releaseNote) {
              return {
                title: releaseNote.title,
                changeTargetSchedule: releaseNote.changeTargetSchedule,
                type: releaseNote.changeType.label,
                status: releaseNote.changeStatus,
                description: releaseNote.description,
                href: releaseNote.fdIssueLink,
                id: releaseNote.releaseNoteId,
              };
            }

            throw new Error('Data format is not compatible');
          })
        : [];

      console.log(releaseNotesItems);
      console.log(releaseNotesPageData);

      return {
        articles: releaseNotesItems,
        nextPage: releaseNotesPageData?.endCursor,
        hasNextPage: releaseNotesPageData?.hasNextPage,
      };
    }

    throw new Error('Data format is not compatible');
  };

  const getWhatsNewArticle = async (articleId: articleId) => {
    const graphqlRequest = JSON.stringify({
      query: `
        query {
          releaseNote(id: "${articleId.id}") {
            releaseNoteId
            title
            description
            changeTargetSchedule
            changeType {label}
          }
        }`,
    });

    try {
      const response = await fetch(CPAPI_URL, {
        method: 'POST',
        credentials: 'include',
        referrerPolicy: 'origin-when-cross-origin',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: graphqlRequest,
      });
      return formatReleaseNoteData(await response.json());
    } catch (error) {
      return error;
    }
  };

  const formatReleaseNoteData = (data: any): WhatsNewArticle => {
    if (data.data?.releaseNote) {
      const releaseNote = data.data?.releaseNote;
      console.log(releaseNote);
      return {
        title: releaseNote.title,
        changeTargetSchedule: releaseNote.changeTargetSchedule,
        type: releaseNote.changeType.label,
        status: releaseNote.changeStatus,
        description: releaseNote.description,
        href: releaseNote.fdIssueLink,
        id: releaseNote.releaseNoteId,
        bodyFormat: BODY_FORMAT_TYPES.adf,
      };
    }

    throw new Error('Data format is not compatible');
  };

  return { token, setToken, searchWhatsNewArticles, getWhatsNewArticle };
};
