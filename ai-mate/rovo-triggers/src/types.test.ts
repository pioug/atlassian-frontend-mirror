import type { RovoChatSourceMode as ServiceRovoChatSourceMode } from '@atlassian/conversation-assistant-service-api/types/assistance-service';

import type { RovoChatSourceMode } from './types';

type IsExactlyEqual<TLeft, TRight> =
	(<T>() => T extends TLeft ? 1 : 2) extends <T>() => T extends TRight ? 1 : 2
		? (<T>() => T extends TRight ? 1 : 2) extends <T>() => T extends TLeft ? 1 : 2
			? true
			: false
		: false;

const sourceModeTypesMatch: IsExactlyEqual<RovoChatSourceMode, ServiceRovoChatSourceMode> = true;

describe('RovoChatSourceMode', () => {
	it('matches the assistance service contract', () => {
		expect(sourceModeTypesMatch).toBe(true);
	});
});
