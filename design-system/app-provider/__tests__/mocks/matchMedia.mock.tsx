const matchMediaObject = {
  matches: false,
  media: '',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(_ => {
    return matchMediaObject;
  }),
});

export function setMatchMediaPrefersDark(prefersDark: boolean) {
  matchMediaObject.matches = prefersDark;
}
