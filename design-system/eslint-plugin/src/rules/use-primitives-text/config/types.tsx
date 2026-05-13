import { type Pattern } from './patterns';

export interface RuleConfig {
	failSilently: boolean;
	patterns: Pattern[];
	inheritColor: boolean;
	enableUnsafeAutofix: boolean;
	enableUnsafeReport: boolean;
}
