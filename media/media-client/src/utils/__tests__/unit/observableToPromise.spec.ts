import { ReplaySubject } from 'rxjs/ReplaySubject';
import { observableToPromise } from '../../observableToPromise';

describe('observableToPromise()', () => {
  it('should return current value regardless of being complete', async () => {
    const subject = new ReplaySubject(1);

    subject.next(1);
    expect(await observableToPromise(subject)).toEqual(1);

    subject.next(2);
    expect(await observableToPromise(subject)).toEqual(2);
  });
});
