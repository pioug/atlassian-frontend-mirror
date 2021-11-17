import resetOptionsInGroup from '../reset-options-in-group';

describe('#resetOptionsInGroup', () => {
  it('reset true to false', () => {
    const group = {
      sydney: true,
    };
    const result = resetOptionsInGroup(group);
    expect(result).toEqual({
      sydney: false,
    });
  });

  it('keep false to false', () => {
    const group = {
      sydney: false,
    };
    const result = resetOptionsInGroup(group);
    expect(result).toEqual({
      sydney: false,
    });
  });

  it('keep undefined to undefined', () => {
    const group = {
      sydney: undefined,
    };
    const result = resetOptionsInGroup(group);
    expect(result).toEqual({
      sydney: undefined,
    });
  });

  it('reset all', () => {
    const group = {
      melbourne: false,
      perth: undefined,
      sydney: true,
    };
    const result = resetOptionsInGroup(group);
    expect(result).toEqual({
      melbourne: false,
      perth: undefined,
      sydney: false,
    });
  });
});
