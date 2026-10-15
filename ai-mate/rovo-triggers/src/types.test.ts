import type {
	AutoActionApprovalMode,
	RovoChatSourceMode as ServiceRovoChatSourceMode,
} from '@atlassian/conversation-assistant-service-api/types/assistance-service';

import type { ChatNewPayload, RovoChatSourceMode } from './types';

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

const approvalModeTypesMatch: IsExactlyEqual<
	NonNullable<NonNullable<ChatNewPayload['data']['mode']>['autoActionApprovalMode']>,
	AutoActionApprovalMode
> = true;

it('keeps action approval on chat-new aligned with the assistance service contract', () => {
	expect(approvalModeTypesMatch).toBe(true);
});
