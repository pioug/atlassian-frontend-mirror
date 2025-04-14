import { withProfiling } from '../../../../self-measurements';

const getViewportWidth = withProfiling(
	function getViewportWidth(document = window.document) {
		let documentWidth;
		try {
			documentWidth = document.documentElement.clientWidth || 0;
		} catch (e) {
			documentWidth = 0;
		}
		return Math.max(documentWidth, window.innerWidth || 0);
	},
	['vc'],
);

export default getViewportWidth;
