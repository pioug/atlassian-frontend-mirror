import { LRUMap } from 'lru_map';
import { StreamsCache } from '../../file-streams-cache';
import { type ReplaySubject } from 'rxjs/ReplaySubject';
import { type FileState } from '@atlaskit/media-state';
import { createMediaSubject } from '../../utils/createMediaSubject';

describe('StreamsCache', () => {
  it('should return the stream if already exist', () => {
    const cache = new StreamsCache(
      new LRUMap<string, ReplaySubject<FileState>>(10),
    );
    const fileStateSubject = createMediaSubject<FileState>();

    cache.set('1', fileStateSubject);

    expect(cache.has('1')).toBeTruthy();
    expect(cache.has('2')).toBeFalsy();
    expect(cache.get('1')).toEqual(fileStateSubject);
  });
});
