import { useState, type Dispatch, type SetStateAction } from 'react';
import type { WhatsNewArticleItem, WhatsNewArticle, articleId } from '../../../src';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';

export interface FilterConfiguration {
	changeStatus?: string[];
	changeTypes?: string[];
	fdIssueKeys?: string[];
	fdIssueLinks?: string[];
	featureRolloutDates?: string[];
	productNames?: string[];
	releaseNoteFlagOffValues?: string[];
	releaseNoteFlags?: string[];
}

const CPAPI_URL = 'https://jdog.jira-dev.com/gateway/api/graphql';
const DEFAULT_NUMBER_OF_WHATS_NEW_ITEMS_RESULTS = 10;

export const useContentPlatformApi = (): {
	getWhatsNewArticle: (articleId: articleId) => Promise<WhatsNewArticle>;
	searchWhatsNewArticles: (
		filter?: FilterConfiguration,
		numberOfItems?: number,
		page?: string,
	) => Promise<{
		articles: WhatsNewArticleItem[];
		hasNextPage: boolean;
		nextPage: string;
	}>;
	setToken: Dispatch<SetStateAction<string>>;
	token: string;
} => {
	const [token, setToken] = useState('');

	const searchWhatsNewArticles = async (
		filter?: FilterConfiguration,
		numberOfItems?: number,
		page?: string,
	): Promise<{
		articles: WhatsNewArticleItem[];
		hasNextPage: boolean;
		nextPage: string;
	}> => {
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
        query getReleaseNotes {
          releaseNotes(${filterValue}${after}${first},orderBy: "featureRolloutDate") {
            edges {
              releaseNote: node {
                  title
                  changeTargetSchedule
                  changeStatus {label}
                  changeType {label}
                  featureRolloutDate
                  fdIssueLink
                  releaseNoteId
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
		hasNextPage: boolean;
		nextPage: string;
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

	const getWhatsNewArticle = async (articleId: articleId): Promise<WhatsNewArticle> => {
		const graphqlRequest = JSON.stringify({
			query: `
        query {
          releaseNote(id: "${articleId.id}") {
            releaseNoteId
            title
            description
            changeTargetSchedule
            changeType {label}
            getStarted
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

			if (releaseNote.getStarted !== null && releaseNote.description !== null) {
				releaseNote.description.content = [
					...releaseNote.getStarted.content,
					...releaseNote.description.content,
				];
			}

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
