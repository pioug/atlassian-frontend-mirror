import { waitFor } from '@testing-library/dom';

import setGlobalTheme from '../../set-global-theme';
import ThemeMutationObserver from '../../theme-mutation-observer';

describe('ThemeMutationObserver', () => {
  it('should observe the theme', async () => {
    const callbackSpy = jest.fn();
    const observer = new ThemeMutationObserver(callbackSpy);
    observer.observe();

    setGlobalTheme({ colorMode: 'dark' });

    await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(1));

    setGlobalTheme({ dark: 'legacy-dark' });

    await waitFor(() => expect(callbackSpy).toHaveBeenCalledTimes(2));
  });
});
