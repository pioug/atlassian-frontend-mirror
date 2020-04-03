import combineProviders from '../../combine-providers';

interface CoolProvider {
  getItem: (letter: string) => Promise<string>;
  getItems: () => Promise<string[]>;
}

class DefaultCoolProvider implements CoolProvider {
  private items: string[];

  constructor(items: string[]) {
    this.items = items;
  }

  getItem(letter: string) {
    if (this.items.includes(letter)) {
      return Promise.resolve(letter);
    }

    return Promise.reject('');
  }

  getItems() {
    return Promise.resolve(this.items);
  }
}

const providerA = new DefaultCoolProvider(['a', 'b', 'c']);
const providerB = Promise.reject(new DefaultCoolProvider(['e', 'f', 'g']));
const providerC = new DefaultCoolProvider(['i', 'j', 'k']);

describe('combine-providers', () => {
  test('should be able to invoke methods that return lists', async () => {
    const { invokeList } = combineProviders<CoolProvider>([
      providerA,
      providerB,
      providerC,
    ]);

    expect(await invokeList<string>('getItems')).toEqual([
      'a',
      'b',
      'c',
      'i',
      'j',
      'k',
    ]);
  });

  test('should be able to invoke methods that return single items', async () => {
    const { invokeSingle } = combineProviders<CoolProvider>([
      providerA,
      providerB,
      providerC,
    ]);

    expect(
      await invokeSingle<string>('getItem', ['a']),
    ).toBe('a');
    expect(
      await invokeSingle<string>('getItem', ['k']),
    ).toBe('k');
  });

  test('should throw if no providers are provided', async () => {
    expect(() => combineProviders<CoolProvider>([])).toThrow(
      new Error('At least one provider must be provided'),
    );
  });

  test('should throw if an unknown method is invoked', async () => {
    const { invokeSingle } = combineProviders<CoolProvider>([
      providerA,
      providerB,
      providerC,
    ]);

    await expect(invokeSingle<string>('getAllItems' as any)).rejects.toEqual(
      new Error(`"getAllItems" isn't a function of the provider`),
    );
  });
});
