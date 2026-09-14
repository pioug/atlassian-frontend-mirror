import type { DatasourceAction } from '../../analytics/types';

export interface UserInteractions {
	add: (action: DatasourceAction) => void;
	get: () => DatasourceAction[];
}
