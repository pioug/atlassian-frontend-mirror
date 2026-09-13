import { fg } from '@atlaskit/platform-feature-flags';
import { getDynamicImportName } from '@atlaskit/codemod-utils';

export default 'dummy-pkg-a' as const;

export function helloWorld():
	| "I am behind a feature flag so I can't break anything!"
	| 'Hello World!' {
	if (fg('platform.renovate-next-dummy-pkg-a')) {
		return "I am behind a feature flag so I can't break anything!";
	} else {
		return 'Hello World!';
	}
}

export function helloWorld2(...args: Parameters<typeof getDynamicImportName>): void {
	getDynamicImportName(...args);
}
