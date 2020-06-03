import getValidTableProps from '../getValidTableProps';

describe('getValidTableProps', () => {
  let spy: jest.SpyInstance<any>;

  beforeEach(() => {
    spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('returns the given props when all props are valid', () => {
    const validProps = getValidTableProps(6, 6, 3, 50);

    expect(validProps).toEqual({
      validPageNumber: 3,
      validTotalItems: 50,
      validItemsPerPage: 6,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('sets validItemsPerPage to 6 when itemsPerPage is undefined', () => {
    const validProps = getValidTableProps(6, undefined, 3, 50);

    expect(validProps.validItemsPerPage).toBe(6);
    expect(spy).not.toHaveBeenCalled();
  });

  it('sets validItemsPerPage to 6 when itemsPerPage is negative', () => {
    const validProps = getValidTableProps(6, -9, 3, 50);

    expect(validProps.validItemsPerPage).toBe(6);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('sets validPageNumber to 1 when pageNumber is undefined', () => {
    const validProps = getValidTableProps(8, 9, undefined, 100);

    expect(validProps.validPageNumber).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('sets validPageNumber to 1 when pageNumber is negative', () => {
    const validProps = getValidTableProps(8, 9, -3, 100);

    expect(validProps.validPageNumber).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('sets validPageNumber to the last page when pageNumber is too high', () => {
    const validProps = getValidTableProps(8, 8, 30, 100);

    expect(validProps.validPageNumber).toBe(13);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('sets validTotalItems to itemsCount and pageNumber to 1 when totalItems is undefined', () => {
    const validProps = getValidTableProps(9, 10, 3, undefined);

    expect(validProps.validTotalItems).toBe(9);
    expect(validProps.validPageNumber).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('sets validTotalItems to itemsCount and pageNumber to 1 when totalItems is negative', () => {
    const validProps = getValidTableProps(9, 10, 3, -100);

    expect(validProps.validTotalItems).toBe(9);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
