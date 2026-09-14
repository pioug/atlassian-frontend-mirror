import { CONFLUENCE_GENERATOR_ID } from './constants';

export const isConfluenceGenerator = (
	id: string,
): id is 'https://www.atlassian.com/#Confluence' => {
	return id === CONFLUENCE_GENERATOR_ID;
};
