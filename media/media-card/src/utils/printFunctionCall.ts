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

export const printFunctionCall: any = <T extends Array<any>>(
	fn: (...args: T) => void,
	...args: T
) => `(${fn.toString()})(${printParams(args)});`;
