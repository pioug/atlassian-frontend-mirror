import { useTranslations } from '../../use-translations';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

describe('Use translations', () => {
	const getMessagesCallbackSpy = jest.fn();
	getMessagesCallbackSpy.mockImplementation(() => Promise.resolve({ key: 'value' }));

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call the callback for get messages if passed', async () => {
		renderHook(() => useTranslations('fr', getMessagesCallbackSpy));

		await waitFor(() => expect(getMessagesCallbackSpy).toHaveBeenCalledTimes(1));

		expect(getMessagesCallbackSpy).toHaveBeenCalledWith('fr');
	});

	it('should return empty messages when no callback passed', async () => {
		const hookResult = renderHook(() => useTranslations('fr'));

		await waitFor(() => expect(hookResult.result.current).not.toBeUndefined());

		expect(hookResult.result.current.messages).toEqual({});
	});

	it('should return locale and messages', async () => {
		const hookResult = renderHook(() => useTranslations('fr', getMessagesCallbackSpy));

		await waitFor(() => expect(hookResult.result.current).not.toBeUndefined());

		expect(hookResult.result.current).toEqual({
			locale: 'fr',
			messages: { key: 'value' },
		});
	});

	it('should call the onWillLocaleChange callback when locale will change', async () => {
		const onWillLocaleChange = jest.fn();
		renderHook(() => useTranslations('fr', getMessagesCallbackSpy, undefined, onWillLocaleChange));

		await waitFor(() => expect(onWillLocaleChange).toHaveBeenCalledTimes(1));

		expect(onWillLocaleChange).toHaveBeenCalledWith();
	});

	it('should call the onLocaleChanged callback when locale changed', async () => {
		const onLocaleChanged = jest.fn();
		renderHook(() => useTranslations('fr', getMessagesCallbackSpy, onLocaleChanged));

		await waitFor(() => expect(onLocaleChanged).toHaveBeenCalledTimes(1));

		expect(onLocaleChanged).toHaveBeenCalledWith();
	});
});
