import type { InteractionType } from '../../common';
import * as ssr from '../../ssr';

export default function getSSRSuccess(type: InteractionType): boolean | undefined {
	if (type !== 'page_load') {
		return undefined;
	}

	return ssr.getSSRSuccess();
}
