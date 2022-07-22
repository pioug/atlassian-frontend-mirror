import {
  LinkPickerPlugin,
  LinkPickerState,
  LinkSearchListItemData,
} from '@atlaskit/link-picker';

import pluginData from './mock-plugin-data';

export class MockLinkPickerPlugin implements LinkPickerPlugin {
  private loadResults(query: string): Promise<LinkSearchListItemData[]> {
    if (!query) {
      return Promise.resolve(pluginData);
    }

    const filtered = pluginData.filter(({ name }) =>
      name.toLowerCase().includes(query.toLowerCase()),
    );

    return Promise.resolve(filtered);
  }

  getInitialResults(query: string): Promise<LinkSearchListItemData[]> {
    return this.loadResults(query);
  }

  fetchUpdatedResults(query: string): Promise<LinkSearchListItemData[]> {
    return this.loadResults(query);
  }

  async *resolve({ query }: LinkPickerState) {
    yield { data: await this.getInitialResults(query) };
    return { data: await this.fetchUpdatedResults(query) };
  }
}

export class MockLinkPickerGeneratorPlugin implements LinkPickerPlugin {
  public asyncGenerator: AsyncGenerator<any, any, any>;
  constructor(public promises: Promise<any>[]) {
    this.asyncGenerator = this._resolve();
    const mockedNext = jest.fn();
    for (const promise of promises) {
      mockedNext.mockReturnValueOnce(promise);
    }
    this.asyncGenerator.next = mockedNext;
  }

  private async *_resolve() {
    yield 1;
    return 2;
  }

  public resolve({ query }: LinkPickerState) {
    return this.asyncGenerator;
  }
}

export class MockLinkPickerPromisePlugin implements LinkPickerPlugin {
  public result: Promise<LinkSearchListItemData[]>;
  constructor() {
    this.result = Promise.resolve(pluginData);
  }

  async resolve({ query }: LinkPickerState) {
    return { data: await this.result };
  }
}
