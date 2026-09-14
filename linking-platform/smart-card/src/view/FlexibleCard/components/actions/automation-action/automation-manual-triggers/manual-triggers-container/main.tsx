import type { ManualRule, ManualRuleInvoker } from './common/types';

export interface ManualRulesData {
	error: any;
	initialised: boolean;
	invokeRuleOrShowDialog: ManualRuleInvoker;
	invokingRuleId: number | null;
	rules: ManualRule[];
	triggerFetch: () => Promise<void>;
}
