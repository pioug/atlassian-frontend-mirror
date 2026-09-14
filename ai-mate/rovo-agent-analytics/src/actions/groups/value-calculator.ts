/**
 * Action Group: valueCalculator
 *
 * Agent Insights value calculator funnel — opening the calculator, stepping
 * through the wizard, saving a value to the dashboard, or abandoning.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `ValueCalculatorEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */

import type { BaseAgentAnalyticsAttributes } from '../../common/types';

type ValueCalculatorMode = 'create' | 'update';
type ValueCalculatorFlow = 'guided' | 'simplified';

export type ValueCalculatorEventPayload =
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorViewed';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorStarted';
			attributes: BaseAgentAnalyticsAttributes & {
				mode: ValueCalculatorMode;
			};
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorNext';
			attributes: BaseAgentAnalyticsAttributes & {
				fromStep: number;
			};
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorBack';
			attributes: BaseAgentAnalyticsAttributes & {
				fromStep: number;
			};
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorAddedToDashboard';
			attributes: BaseAgentAnalyticsAttributes & {
				mode: ValueCalculatorMode;
				valueType: string | null;
			};
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorRemoved';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			actionSubject: 'rovoAgent';
			action: 'valueCalculatorAbandoned';
			attributes: BaseAgentAnalyticsAttributes & {
				flow: ValueCalculatorFlow;
				lastStep: number;
			};
	  };
