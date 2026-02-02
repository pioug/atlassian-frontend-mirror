import { waitFor } from '@testing-library/react';

import setGlobalTheme from '../../set-global-theme';
import ThemeMutationObserver from '../../theme-mutation-observer';

describe('ThemeMutationObserver', () => {
	it('should observe the theme', async () => {
		const callbackSpy = jest.fn();
		const observer = new ThemeMutationObserver(callbackSpy);
		observer.observe();

		setGlobalTheme({ colorMode: 'dark' });

		await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(1));

		setGlobalTheme({ dark: 'dark-increased-contrast' });

		await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(2));
	});

	it('should report theme changes to multiple instances/observers', async () => {
		const callbackSpy1 = jest.fn();
		const callbackSpy2 = jest.fn();
		const observer1 = new ThemeMutationObserver(callbackSpy1);
		const observer2 = new ThemeMutationObserver(callbackSpy2);

		observer1.observe();
		observer2.observe();

		setGlobalTheme({ colorMode: 'dark' });

		await waitFor(() => {
			expect(callbackSpy1).toHaveBeenCalledTimes(1);
		});
		expect(callbackSpy2).toHaveBeenCalledTimes(1);
		expect(callbackSpy1).toHaveBeenCalledWith(
			expect.objectContaining({ dark: 'dark', colorMode: 'dark' }),
		);
		expect(callbackSpy2).toHaveBeenCalledWith(
			expect.objectContaining({ dark: 'dark', colorMode: 'dark' }),
		);
		setGlobalTheme({ dark: 'light' });

		await waitFor(() => {
			expect(callbackSpy1).toHaveBeenCalledTimes(2);
		});
		expect(callbackSpy2).toHaveBeenCalledTimes(2);
		expect(callbackSpy1).toHaveBeenCalledWith(expect.objectContaining({ dark: 'light' }));
		expect(callbackSpy2).toHaveBeenCalledWith(expect.objectContaining({ dark: 'light' }));
	});

	it('should not call observer callbacks once disconnected', async () => {
		const callbackSpy1 = jest.fn();
		const callbackSpy2 = jest.fn();
		const observer1 = new ThemeMutationObserver(callbackSpy1);
		const observer2 = new ThemeMutationObserver(callbackSpy2);

		observer1.observe();
		observer2.observe();
		observer2.disconnect();

		setGlobalTheme({ colorMode: 'dark' });

		await waitFor(() => {
			expect(callbackSpy1).toHaveBeenCalledTimes(1);
		});
		expect(callbackSpy2).toHaveBeenCalledTimes(0);
		expect(callbackSpy1).toHaveBeenCalledWith(
			expect.objectContaining({ dark: 'dark', colorMode: 'dark' }),
		);
		// Disconnect the final observer and verify neither is called
		observer1.disconnect();
		callbackSpy1.mockClear();
		callbackSpy2.mockClear();
		setGlobalTheme({ colorMode: 'light' });

		await waitFor(() => {
			expect(callbackSpy1).toHaveBeenCalledTimes(0);
		});
		expect(callbackSpy2).toHaveBeenCalledTimes(0);

		// Reconnect the observer and verify it works as expected
		observer1.observe();
		callbackSpy1.mockClear();
		callbackSpy2.mockClear();
		setGlobalTheme({ colorMode: 'light' });

		await waitFor(() => {
			expect(callbackSpy1).toHaveBeenCalledTimes(0);
		});
		expect(callbackSpy2).toHaveBeenCalledTimes(0);
	});
});
