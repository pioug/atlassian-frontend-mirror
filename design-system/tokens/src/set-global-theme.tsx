const setGlobalTheme = (theme: 'dark' | 'light') => {
  if (process.env.NODE_ENV !== 'production') {
    // check some pre-condition and throw if incorrect?
    if (theme !== 'dark' && theme !== 'light') {
      throw new Error("setGlobalTheme only accepts 'light' or 'dark' themes");
    }
  }

  const element = document.documentElement;
  element.setAttribute('data-theme', theme);
};

export default setGlobalTheme;
