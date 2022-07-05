import { LinkPickerPlugin, LinkSearchListItemData } from '../../../types';

class MockLinkPickerPlugin implements LinkPickerPlugin {
  getInitialResults(): Promise<LinkSearchListItemData[]> {
    return Promise.resolve([]);
  }

  fetchUpdatedResults(): Promise<LinkSearchListItemData[]> {
    return Promise.resolve([]);
  }

  async *resolve() {
    yield { data: await this.getInitialResults() };
    return { data: await this.fetchUpdatedResults() };
  }
}

export default MockLinkPickerPlugin;
