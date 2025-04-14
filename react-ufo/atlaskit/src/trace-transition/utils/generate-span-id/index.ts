import { withProfiling } from '../../../self-measurements';

export const generateSpanId = withProfiling(function generateSpanId() {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
});
