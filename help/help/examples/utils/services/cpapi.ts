import { useState } from 'react';
import type {
  WhatsNewArticleItem,
  WhatsNewArticle,
  articleId,
} from '../../../src';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';

export interface FilterConfiguration {
  fdIssueKeys?: string[];
  fdIssueLinks?: string[];
  changeTypes?: string[];
  productNames?: string[];
  changeStatus?: string[];
  featureRolloutDates?: string[];
  releaseNoteFlags?: string[];
  releaseNoteFlagOffValues?: string[];
}

const CPAPI_URL =
  'https://content-platform-api.stg.services.atlassian.com/graphql';
const DEFAULT_NUMBER_OF_WHATS_NEW_ITEMS_RESULTS = 10;

export const useContentPlatformApi = () => {
  const [token, setToken] = useState('');

  const searchWhatsNewArticles = async (
    filter?: FilterConfiguration,
    numberOfItems?: number,
    page?: string,
  ) => {
    let filterValue = '';

    if (filter && Object.keys(filter).length > 0) {
      filterValue = `filter:{`;
      Object.keys(filter).map((key, index) => {
        filterValue += `${key} : [${Object.values(filter)[index].toString()}]`;
      });
      filterValue += `}, `;
    }

    const after = page ? `after: "${page}", ` : '';
    const first = `first: ${
      numberOfItems ? numberOfItems : DEFAULT_NUMBER_OF_WHATS_NEW_ITEMS_RESULTS
    }`;

    const graphqlRequest = JSON.stringify({
      query: `
        query {
          releaseNotes(${filterValue}${after}${first},orderBy: "rolloutDate") {
            edges {
              releaseNote: node {
                releaseNoteId
                fdIssueLink
                fdIssueKey
                title
                description
                changeStatus {label}
                changeType {label}
                featureRolloutDate
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
      console.warn(error);
      throw new Error('Request error');
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
                featureRolloutDate: releaseNote.featureRolloutDate,
              };
            }

            throw new Error('Data format is not compatible');
          })
        : [];

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
      console.warn(error);
      throw new Error('Request error');
    }
  };

  const formatReleaseNoteData = (data: any): WhatsNewArticle => {
    if (data.data?.releaseNote) {
      const releaseNote = data.data?.releaseNote;

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
