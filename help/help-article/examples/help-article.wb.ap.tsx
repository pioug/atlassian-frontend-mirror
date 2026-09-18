import { wb, type WorkbenchExample } from '@atlassian/workbench';

import HelpArticleExample from './1-Help-article';
import HelpArticleAdfExample from './2-Help-article-adf';

export const HelpArticle: WorkbenchExample = wb(HelpArticleExample);
export const HelpArticleAdf: WorkbenchExample = wb(HelpArticleAdfExample);
