// eslint-disable-next-line import/no-extraneous-dependencies
import type {
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
