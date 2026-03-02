import { getIsRovoChatEnabled } from '../rovo.ts';

describe('getIsRovoChatEnabled', () => {
	it('should return false if rovo config is not provided', () => {
		expect(getIsRovoChatEnabled()).toBeFalsy();
	});

	it('should return true if both isRovoEnabled and isRovoLLMEnabled are true', () => {
		expect(getIsRovoChatEnabled({ isRovoEnabled: true, isRovoLLMEnabled: true })).toBeTruthy();
	});

	it('should return true if both isRovoEnabled and isRovoLLMEnabled are false', () => {
		expect(getIsRovoChatEnabled({ isRovoEnabled: false, isRovoLLMEnabled: false })).toBeFalsy();
	});

	it('should return false if isRovoEnabled is false', () => {
		expect(getIsRovoChatEnabled({ isRovoEnabled: false, isRovoLLMEnabled: true })).toBeFalsy();
	});

	it('should return false if isRovoLLMEnabled is false', () => {
		expect(getIsRovoChatEnabled({ isRovoEnabled: true, isRovoLLMEnabled: false })).toBeFalsy();
	});
});
