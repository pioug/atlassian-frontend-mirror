import React, { useMemo, useState } from 'react';

import { di } from 'react-magnetic-di';

import { ModalTransition } from '@atlaskit/modal-dialog';

import type {
	Ari,
	InvocationResponse,
	ManualRule,
	ManualRuleInvoker,
	ManualRulesById,
	RuleQuery,
	SelectedRule,
	UserInputs,
} from './common/types';
import { invokeManuallyTriggeredRule, searchManuallyTriggeredRules } from './services';

import UserInputForm from './manual-triggers-form/main';

/**
 * React hook that implements the fetch and invoke actions for manual triggers.
 * Can be used standalone or in the HOC provided below.
 * @param site - The site to filter on. We map this to just a cloudId to resolve the manual rules API path
 * @param query - Query object containing filter props (container, object(s))
 */
export const useManualRules = (site: Ari, query: RuleQuery) => {
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

export interface ManualRulesData {
	triggerFetch: () => Promise<void>;
	initialised: boolean;
	error: any;
	rules: ManualRule[];
	invokingRuleId: number | null;
	invokeRuleOrShowDialog: ManualRuleInvoker;
}

export interface ManualRulesContainerProps {
	site: Ari; // extract cloudId from this value
	query: RuleQuery;

	onInputsModalOpened?: () => void;
	onInputsModalClosed?: () => void;

	/********
	 * Lifecycle handlers
	 */

	// A call to the invocation API is made here, with one or more objects.
	// The success/failure of invocation is unknown.
	onRuleInvocationLifecycleStarted?: (
		ruleId: number,
		objectIds: string[],
		inputs: UserInputs | undefined,
	) => void;
	// The call to the invocation API succeeded for ALL objects. The success/failure
	// of async execution of the rule is unknown.
	onRuleInvocationSuccess?: (ruleId: number, objectIds: string[]) => void;
	// The call to the invocation API failed for ONE or MORE objects (but not neccessarily all objects).
	// The success/failure of execution for the objects that successfully had a rule invocation
	// is unknown.
	onRuleInvocationFailure?: (
		ruleId: number,
		successfulObjectIds: string[],
		failedObjects: string[],
	) => void;
	// The call to the invocation API is done.
	onRuleInvocationLifecycleDone?: (ruleId: number, objectIds: string[]) => void;

	children: (data: ManualRulesData) => React.ReactElement;
}

/**
 *
 * Container HOC that implements the above hook and behaviours.
 *
 * This HOC uses rendered props to allow the use of any render instructions
 * for manual rules, while still maintaining the behaviour of invoking rules.
 *
 * The HOC also appends a dialog that is displayed when the {@code invokeRuleOrShowDialog}
 * prop is called, if the underlying rule has user inputs.
 *
 * The component exposes the "invokingRuleId" property to the child hierarchy,
 * because the children might care about the invocation state. It does not expose
 * the "selected" state, or any information about the dialog, as the children
 * should not care about this, only how to trigger invocation and understand
 * the invocation lifecycle.
 *
 * @param props - cloudId, projectId, children
 */
export const ManualRulesContainer: React.FC<ManualRulesContainerProps> = (
	props: ManualRulesContainerProps,
) => {
	di(
		ModalTransition,
		UserInputForm,
		invokeManuallyTriggeredRule,
		useManualRules,
		useMemo,
		useState,
	);
	const {
		site,
		query,
		children,

		onInputsModalOpened,
		onInputsModalClosed,
		onRuleInvocationLifecycleStarted,
		onRuleInvocationSuccess,
		onRuleInvocationFailure,
		onRuleInvocationLifecycleDone,
	} = props;
	// Initial data loading state
	const [triggerFetch, initialised, error, rules] = useManualRules(site, query);
	// We store a rule in state here if and only if a rule has user inputs, and thus
	// we need to preserve state while the input dialog is open.
	const [selectedRule, setSelectedRule] = useState<SelectedRule | null>(null);
	const clearSelectedRule = () => {
		setSelectedRule(null);
	};
	// Value set when a rule is invoking, either from the dialog or without dialog
	const [invokingRuleId, setInvokingRuleId] = useState<number | null>(null);

	// Memoized projection of rules by id
	const rulesById: ManualRulesById = useMemo(
		() =>
			rules.reduce(
				(acc: ManualRulesById, rule: ManualRule) => ({
					// eslint-disable-next-line
					...acc,
					[rule.id]: rule,
				}),
				{},
			),
		[rules],
	);
	const getRule = (id: number): ManualRule => rulesById[id];

	const ruleHasInputs = (rule: ManualRule): boolean => rule?.userInputPrompts?.length > 0;

	const getFailedObjects = (response: InvocationResponse): string[] =>
		Object.keys(response).filter((object) => response[object] !== 'SUCCESS');
	const getSuccessfulObjects = (response: InvocationResponse): string[] =>
		Object.keys(response).filter((object) => response[object] === 'SUCCESS');

	const handleInvocationFailure = (
		ruleId: number,
		successfulObjects: string[],
		failedObjects: string[],
	): void => {
		if (onRuleInvocationFailure) {
			onRuleInvocationFailure(ruleId, successfulObjects, failedObjects);
		}
	};

	const invokeRule = async (
		ruleId: number,
		objects: Ari[],
		userInputs?: UserInputs,
	): Promise<void> => {
		const rule = getRule(ruleId);

		if (rule) {
			setInvokingRuleId(ruleId);

			try {
				if (onRuleInvocationLifecycleStarted) {
					onRuleInvocationLifecycleStarted(ruleId, objects, userInputs);
				}
				const response = await invokeManuallyTriggeredRule(site, ruleId, objects, userInputs);
				const failedObjects: string[] = getFailedObjects(response);
				setInvokingRuleId(null);

				if (failedObjects.length === 0) {
					if (onRuleInvocationSuccess) {
						onRuleInvocationSuccess(ruleId, objects);
					}
				} else {
					const successfulObjects = getSuccessfulObjects(response);
					handleInvocationFailure(ruleId, successfulObjects, failedObjects);
				}
			} catch (e: any) {
				handleInvocationFailure(ruleId, [], objects);
				setInvokingRuleId(null);
			}
		} else {
			handleInvocationFailure(ruleId, [], objects);
		}
		clearSelectedRule();
		if (onRuleInvocationLifecycleDone) {
			onRuleInvocationLifecycleDone(ruleId, objects);
		}
	};

	const invokeRuleOrShowDialog = (ruleId: number, objects: Ari[]) => {
		const rule = getRule(ruleId);
		if (!rule) {
			return handleInvocationFailure(ruleId, [], objects);
		}

		if (ruleHasInputs(rule)) {
			setSelectedRule({
				rule,
				objects,
			});
		} else {
			invokeRule(ruleId, objects);
		}
	};

	return (
		<>
			{children({
				triggerFetch,
				initialised,
				error,
				rules,
				invokingRuleId,
				invokeRuleOrShowDialog,
			})}
			<ModalTransition>
				{selectedRule && (
					<UserInputForm
						onInputsModalOpened={onInputsModalOpened}
						onInputsModalClosed={onInputsModalClosed}
						clearSelectedRule={clearSelectedRule}
						selectedRule={selectedRule}
						invokeRule={invokeRule}
					/>
				)}
			</ModalTransition>
		</>
	);
};
