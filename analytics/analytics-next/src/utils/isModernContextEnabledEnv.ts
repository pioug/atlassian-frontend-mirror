/// <reference types="node" />
export default typeof process !== 'undefined' &&
	process !== null &&
	process.env?.['ANALYTICS_NEXT_MODERN_CONTEXT'];
