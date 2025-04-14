import { withProfiling } from '../../../../self-measurements';
import type { ViewportEntryData } from '../../types';

const isViewportEntryData = withProfiling(
	function isViewportEntryData(data: any): data is ViewportEntryData {
		if (data) {
			const hasElementName = typeof data.elementName === 'string';
			const hasRect = typeof data.rect !== 'undefined';

			if (hasRect && hasElementName) {
				return true;
			}
		}
		return false;
	},
	['vc'],
) as (data: any) => data is ViewportEntryData;

export default isViewportEntryData;
