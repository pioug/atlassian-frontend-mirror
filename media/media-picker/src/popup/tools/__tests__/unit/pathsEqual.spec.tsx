import { pathsEqual } from '../../pathsEqual';

describe('pathsEqual() helper method', () => {
  it('returns true on equal paths', () => {
    const folder1: any = [{ id: 'folder1' }, { id: 'folder2' }];
    const folder2: any = [{ id: 'folder1' }, { id: 'folder2' }];
    expect(pathsEqual(folder1, folder2)).toBeTruthy();

    const folder3: any = [];
    const folder4: any = [];
    expect(pathsEqual(folder3, folder4)).toBeTruthy();
  });

  it('returns false on different paths', () => {
    const folder1: any = [{ id: 'folder1' }, { id: 'folder2' }];
    const folder2: any = [{ id: 'folder3' }, { id: 'folder4' }];
    expect(pathsEqual(folder1, folder2)).toBeFalsy();

    const folder3: any = [{ id: 'folder1' }, { id: 'folder2' }];
    const folder4: any = [
      { id: 'folder1' },
      { id: 'folder2' },
      { id: 'folder3' },
    ];
    expect(pathsEqual(folder3, folder4)).toBeFalsy();

    const folder5: any = [];
    const folder6: any = [
      { id: 'folder1' },
      { id: 'folder2' },
      { id: 'folder3' },
    ];
    expect(pathsEqual(folder5, folder6)).toBeFalsy();
  });

  it('return false when one or more paths have wrong format', () => {
    const folder1: any = 'string';
    const folder2: any = [{ id: 'folder3' }, { id: 'folder4' }];
    expect(pathsEqual(folder1, folder2)).toBeFalsy();

    const folder3: any = [{ id: 'folder1' }, { id: 'folder2' }];
    const folder4: any = null;
    expect(pathsEqual(folder3, folder4)).toBeFalsy();

    const folder5: any = [
      { id: 'folder1' },
      { id: 'folder2' },
      { id: 'folder3' },
    ];
    const folder6: any = [{}, { id: 'folder2' }, { id: 'folder3' }];
    expect(pathsEqual(folder5, folder6)).toBeFalsy();
  });
});
