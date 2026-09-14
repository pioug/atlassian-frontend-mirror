import { useState } from 'react';

import type { Ari, ManualRule, ManualRulesById, RuleQuery } from './common/types';
import { searchManuallyTriggeredRules } from './services/searchManuallyTriggeredRules';

/**
 * React hook that implements the fetch and invoke actions for manual triggers.
 * Can be used standalone or in the HOC provided below.
 * @param site - The site to filter on. We map this to just a cloudId to resolve the manual rules API path
 * @param query - Query object containing filter props (container, object(s))
 */
export const useManualRules = (site: Ari, query: RuleQuery): any[] => {
	const [initialised, setInitialised] = useState(false);
	const [error, setError] = useState<any>(null);
	const [rules, setRules] = useState<ManualRule[]>([]);

	const transformRules = (ruleResponse: ManualRulesById): any[] => {
		const rulesUnsorted: ManualRule[] = Object.values(ruleResponse) as any;
		return rulesUnsorted.sort((rule1: ManualRule, rule2: ManualRule) =>
			rule1.name.localeCompare(rule2.name),
		);
	};

	const triggerFetch = async () => {
		setInitialised(false);
		try {
			const fetchedRules = await searchManuallyTriggeredRules(site, query);
			setError(null);
			setRules(transformRules(fetchedRules));
		} catch (e) {
			setError(e);
			setRules([]);
		} finally {
			setInitialised(true);
		}
	};

	return [triggerFetch, initialised, error, rules];
};
