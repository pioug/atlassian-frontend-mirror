import {
  type LinkPickerPlugin,
  type LinkPickerPluginAction,
  type LinkPickerPluginErrorFallback,
  type LinkPickerState,
  type LinkSearchListItemData,
} from '../../common/types';
import { UnauthenticatedError } from '../../common/utils/errors';

import mockPluginData from './mock-plugin-data';

export class UnstableMockLinkPickerPlugin implements LinkPickerPlugin {
  private readonly _tabKey?: string;
  private readonly _tabTitle?: string;
  private hasThrown: boolean;
  errorFallback?: LinkPickerPluginErrorFallback;

  constructor({
    tabKey,
    tabTitle,
    errorFallback,
  }: {
    tabKey?: string;
    tabTitle?: string;
    promise?: Promise<LinkSearchListItemData[]>;
    errorFallback?: LinkPickerPluginErrorFallback;
  } = {}) {
    this._tabKey = tabKey;
    this._tabTitle = tabTitle;
    this.hasThrown = false;
    this.errorFallback = errorFallback;
  }

  private loadResults(_query: string): Promise<LinkSearchListItemData[]> {
    if (!this.hasThrown) {
      this.hasThrown = true;

      // When an errorFallback is provided treat it as an unAuthenticated error
      if (this.errorFallback) {
        throw new UnauthenticatedError('iconUrl', 'authUrl', 'Please connect!');
      }

      throw new Error('Unstable plugin error');
    }

    return Promise.resolve(mockPluginData);
  }

  async resolve({ query }: LinkPickerState) {
    return { data: await this.loadResults(query) };
  }

  get tabKey() {
    return this._tabKey;
  }

  get tabTitle() {
    return this._tabTitle;
  }
}

export class MockLinkPickerPromisePlugin implements LinkPickerPlugin {
  private readonly _tabKey?: string;
  private readonly _tabTitle?: string;
  private readonly _action?: LinkPickerPluginAction;
  public result: Promise<LinkSearchListItemData[]>;

  constructor({
    tabKey,
    tabTitle,
    promise = Promise.resolve(mockPluginData),
    action,
  }: {
    tabKey?: string;
    tabTitle?: string;
    promise?: Promise<LinkSearchListItemData[]>;
    action?: LinkPickerPluginAction;
  } = {}) {
    this.result = promise;

    this._tabKey = tabKey;
    this._tabTitle = tabTitle;
    this._action = action;
  }

  async resolve({ query }: LinkPickerState) {
    return { data: await this.result };
  }

  get tabKey() {
    return this._tabKey;
  }

  get tabTitle() {
    return this._tabTitle;
  }

  get action() {
    return this._action;
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

export class MockLinkPickerPlugin implements LinkPickerPlugin {
  private loadResults(query: string): Promise<LinkSearchListItemData[]> {
    if (!query) {
      return Promise.resolve(mockPluginData);
    }

    const filtered = mockPluginData.filter(({ name }) =>
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
