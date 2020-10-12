import {
  ConfluenceRecentsMap,
  Result,
  ConfluenceObjectResult,
} from '../model/Result';
import ConfluenceClientImpl from './ConfluenceClient';
import { SimpleCache } from '../util/simple-cache';

export default class CachingConfluenceClient extends ConfluenceClientImpl {
  itemCache: SimpleCache<Promise<ConfluenceObjectResult[]>>;
  spaceCache: SimpleCache<Promise<Result[]>>;

  constructor(url: string, prefetchedResults?: Promise<ConfluenceRecentsMap>) {
    super(url);

    this.itemCache = new SimpleCache(
      prefetchedResults &&
        prefetchedResults.then(result => result.objects.items),
      () => super.getRecentItems(),
    );

    this.spaceCache = new SimpleCache(
      prefetchedResults &&
        prefetchedResults.then(result => result.spaces.items),
      () => super.getRecentSpaces(),
    );
  }

  async getRecentItems(): Promise<ConfluenceObjectResult[]> {
    return await this.itemCache.get();
  }

  async getRecentSpaces(): Promise<Result[]> {
    return await this.spaceCache.get();
  }
}
