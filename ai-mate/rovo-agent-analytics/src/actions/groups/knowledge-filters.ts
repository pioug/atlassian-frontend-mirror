import type { BaseAgentAnalyticsAttributes } from '../../common/types';

type FilterAttributes = {
	id: string;
	selectedOptionsCount: number;
};

type KnowledgeSourceAttributes = BaseAgentAnalyticsAttributes & {
	productKey: string;
};

export type KnowledgeFiltersEventPayload =
	| {
			actionSubject: 'rovoAgent';
			action: 'knowledgeFiltersOpened';
			attributes: KnowledgeSourceAttributes;
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'knowledgeFiltersClosed';
			attributes: KnowledgeSourceAttributes;
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'knowledgeFiltersSaved';
			attributes: KnowledgeSourceAttributes & {
				filterCount: number;
				filters: {
					[key: string]: Omit<FilterAttributes, 'id'>;
				};
			};
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'knowledgeFiltersUpdated';
			attributes: KnowledgeSourceAttributes & {
				filter: FilterAttributes;
			};
	  };
