import { containsClass } from '../main';

describe('containsClass', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console as any).error.mockRestore();
  });

  afterEach(() => {
    (console as any).error.mockClear();
  });

  it('should return false if element is invalid', () => {
    const mockedElement = {} as Element;

    expect(containsClass(mockedElement, 'test')).toBe(false);
    expect((console as any).error).not.toHaveBeenCalled();
  });

  it('should return true if element classList contains class', () => {
    const element = document.createElement('div');
    element.classList.add('test');

    expect(containsClass(element, 'test')).toBe(true);
    expect((console as any).error).not.toHaveBeenCalled();
  });

  it('should return false if element is vaid but classList does not contain class', () => {
    const element = document.createElement('div');

    expect(containsClass(element, 'test')).toBe(false);
    expect((console as any).error).not.toHaveBeenCalled();
  });

  it('should return false if element is undefined', () => {
    expect(containsClass(undefined as any, 'test')).toBe(false);
    expect((console as any).error).not.toHaveBeenCalled();
  });

  it('should return false if element is valid but class is undefined', () => {
    const element = document.createElement('div');

    expect(containsClass(element, undefined as any)).toBe(false);
    expect((console as any).error).not.toHaveBeenCalled();
  });
});
