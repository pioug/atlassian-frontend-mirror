import React, { type PropsWithChildren } from 'react';

import { IntlProvider } from 'react-intl';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { DEFAULT_LOCALE_STATE, NEW_DEFAULT_LOCALE_STATE } from '../../common/constants';

import { useSafeIntl } from './index';

describe('useSafeIntl()', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	const translated = { foo: 'Translated string' };

	ffTest.on('navx-4615-fix-async-intl-for-gsn', '', () => {
		it('should return NEW default Intl shape when no Intl Context', () => {
			const result = renderHook(() => {
				return useSafeIntl();
			});

			expect(result.current.locale).toEqual(NEW_DEFAULT_LOCALE_STATE.locale);
		});
	});

	ffTest.off('navx-4615-fix-async-intl-for-gsn', '', () => {
		it('should return default Intl shape when no Intl Context', () => {
			const result = renderHook(() => {
				return useSafeIntl();
			});

			expect(result.current.locale).toEqual(DEFAULT_LOCALE_STATE.locale);
		});
	});

	it('should return Intl context when a provider is present', () => {
		const testWrapper = ({ children }: { children?: React.ReactNode }) => (
			<IntlProvider locale="es-ES" messages={translated}>
				{children}
			</IntlProvider>
		);

		const wrapper = (props: PropsWithChildren) => testWrapper(props);

		const result = renderHook(
			() => {
				return useSafeIntl();
			},
			{ wrapper },
		);

		expect(result.current.messages).toEqual(translated);
	});
});
