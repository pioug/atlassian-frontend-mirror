import { wb, type WorkbenchExample } from '@atlassian/workbench';

import WithConfluenceSearchModalExample from '../with-confluence-search-modal.vr.ap';

export const WithConfluenceSearchModal: WorkbenchExample<typeof WithConfluenceSearchModalExample> =
	wb(WithConfluenceSearchModalExample);
