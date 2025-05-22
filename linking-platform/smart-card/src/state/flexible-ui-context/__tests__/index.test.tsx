import { renderHook } from '@testing-library/react-hooks';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getFlexibleCardTestWrapper } from '../../../__tests__/__utils__/unit-testing-library-helpers';
import { SmartLinkSize, SmartLinkStatus } from '../../../constants';
import { useFlexibleCardContext, useFlexibleUiContext, useFlexibleUiOptionContext } from '../index';

describe('useFlexibleCardContext', () => {
	ffTest.on('platform-linking-flexible-card-context', 'with fg', () => {
		it('provides correct context to consumer', () => {
			const data = { title: 'This is title.' };
			const status = SmartLinkStatus.Resolved;
			const ui = { size: SmartLinkSize.Small, zIndex: 20 };
			const { current } = renderHook(() => useFlexibleCardContext(), {
				wrapper: getFlexibleCardTestWrapper(data, ui),
			}).result;

			expect(current?.data).toEqual(data);
			expect(current?.status).toEqual(status);
			expect(current?.ui).toEqual(ui);
		});
	});
});

describe('useFlexibleUiContext', () => {
	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('provides correct context to consumer', () => {
			const context = { title: 'This is title.' };
			const { current } = renderHook(() => useFlexibleUiContext(), {
				wrapper: getFlexibleCardTestWrapper(context),
			}).result;

			expect(current).toEqual(context);
		});
	});
});

describe('useFlexibleUiOptionContext', () => {
	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('provides correct context to consumer', () => {
			const ui = { size: SmartLinkSize.Small, zIndex: 20 };
			const { current } = renderHook(() => useFlexibleUiOptionContext(), {
				wrapper: getFlexibleCardTestWrapper(undefined, ui),
			}).result;

			expect(current).toEqual(ui);
		});
	});
});
