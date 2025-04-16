import type { Rule } from 'eslint';

// Need to intersect type RuleListener with a generic function to allow use of Parameters<...> to be used
type SingleRuleListener = Rule.RuleListener[keyof Rule.RuleListener] & ((...args: any[]) => void);

// Allow config to be to be easily passed from rules
type ErrorBoundaryConfig =
	| undefined
	| boolean // Bool config applies to FailSilently
	| { failSilently?: boolean }
	| { config: { failSilently?: boolean } };

/**
 * ESLint rules should NEVER throw exceptions, because that breaks the VSCode ESLint server
 * (and probably the IntelliJ one too), which causes linting to fail in a file.
 *
 * It also breaks CI, which was the reason this error boundary was added. It's a final
 * catch all.
 */
export function errorBoundary<R extends SingleRuleListener | Rule.RuleListener>(
	ruleOrRules: R,
	config: ErrorBoundaryConfig = false,
): R {
	const failSilently = failSilentlyFromConfig(config);
	if (isSingleRuleListener(ruleOrRules)) {
		return wrapSingleRuleListener(ruleOrRules, failSilently);
	}

	return wrapRuleListener(ruleOrRules, failSilently) as R;
}

function isSingleRuleListener(
	rule: SingleRuleListener | Rule.RuleListener,
): rule is SingleRuleListener {
	return typeof rule === 'function';
}

function failSilentlyFromConfig(c: ErrorBoundaryConfig): boolean {
	switch (typeof c) {
		case 'undefined':
			return false;
		case 'boolean':
			return c;
		case 'object':
			if ('failSilently' in c) {
				return c.failSilently ?? false;
			} else if ('config' in c) {
				return c.config.failSilently ?? false;
			}
			return false;
		default:
			throw new Error('Invalid config');
	}
}

function wrapSingleRuleListener<R extends SingleRuleListener>(rule: R, failSilently: boolean): R {
	return ((...args: Parameters<SingleRuleListener>): void => {
		try {
			rule(...args);
		} catch (err) {
			if (!failSilently) {
				// eslint-disable-next-line no-console
				console.warn(err);
			}
		}
	}) as R;
}

function wrapRuleListener<R extends Rule.RuleListener>(ruleListener: R, failSilently: boolean): R {
	return Object.entries(ruleListener as Rule.RuleListener).reduce((wrappedRuleListener, e) => {
		const ruleName = e[0] as keyof R;
		const rule = e[1] as R[typeof ruleName] & SingleRuleListener;
		return Object.assign(wrappedRuleListener, {
			[ruleName]: wrapSingleRuleListener(rule, failSilently),
		});
	}, {} as R);
}
