import { fg } from '@atlaskit/platform-feature-flags';

const printParam = (param: any) => {
	if (typeof param === 'string') {
		return `'${param}'`;
	} else if (typeof param === 'object') {
		return JSON.stringify(param);
	} else if (param === undefined) {
		return 'undefined';
	}
	return param;
};

const printParams = (args: Array<any>) => args.map((arg) => printParam(arg)).join(',');

export const printFunctionCall = <T extends Array<any>>(fn: (...args: T) => void, ...args: T) =>
	`(${fn.toString()})(${printParams(args)});`;

// Removing the script tag after execution to prevent hydration
// mismatch issues after SSR. We don't want to render different
// HTML on the client and server https://react.dev/reference/react-dom/client/hydrateRoot
export const printScript = (statements: string[]) =>
	fg('platform_remove_media_script_after_execution')
		? `(function(){
 			 ${statements.join(';')}
  			document.currentScript.remove();
		})();
		`
		: `(function(){
   			${statements.join(';')}
 		})();`;
