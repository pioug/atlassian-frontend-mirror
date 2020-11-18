import { useTranslations } from '../../use-translations';
import { renderHook } from '@testing-library/react-hooks';
import { wait } from '@testing-library/react';
import * as QueryParameter from '../../../query-param-reader';

describe('Use translations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should call the callback for get messages if passed', async () => {
    const getLocaleValueSpy = jest.spyOn(QueryParameter, 'getLocaleValue');
    const locale = 'es';

    getLocaleValueSpy.mockImplementation(jest.fn().mockReturnValue(locale));
    const getMessagesCallbackSpy = jest.fn();
    getMessagesCallbackSpy.mockImplementation(() =>
      Promise.resolve({ key: 'value' }),
    );
    renderHook(() => useTranslations(getMessagesCallbackSpy));
    await wait(() => expect(getMessagesCallbackSpy).toHaveBeenCalledTimes(1));
    expect(getMessagesCallbackSpy).toHaveBeenCalledWith(locale);
  });

  it('should return empty messages when no callback passed', () => {
    let result: [string, Object | undefined] = ['', undefined];
    renderHook(() => (result = useTranslations()));
    expect(result[1]).toEqual({});
  });
});
