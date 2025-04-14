import { withProfiling } from '../../../../self-measurements';

const getViewportHeight = withProfiling(
	function getViewportHeight(document = window.document) {
		let documentHeight;
		try {
			documentHeight = document.documentElement.clientHeight || 0;
		} catch (e) {
			documentHeight = 0;
		}
		return Math.max(documentHeight, window.innerHeight || 0);
	},
	['vc'],
);

export default getViewportHeight;
