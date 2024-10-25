import { renderHook } from '@testing-library/react-hooks';

import { SmartLinkEvents, useSmartLinkEvents } from '../../../index';

describe('useSmartLinkEvents hook', () => {
	it('renders custom hook', () => {
		const { result } = renderHook(() => useSmartLinkEvents());
		expect(result.current).toBeInstanceOf(SmartLinkEvents);
	});
});
