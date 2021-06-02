import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { HashedBlob } from '../../src/domain';
import { probinator } from '../../src/probinator';
import { range } from 'rxjs/observable/range';
import { tap } from 'rxjs/operators/tap';

describe('Probinator', () => {
  const setup = (exists = false) => {
    return {
      batchSize: 3,
      prober: jest
        .fn()
        .mockImplementation((hashedBlobs: HashedBlob[]) =>
          Promise.resolve(hashedBlobs.map((_) => exists)),
        ),
    };
  };

  it('should not call prober for empty input stream', () => {
    const { batchSize, prober } = setup();

    return probinator(createHashedBlob$(0), {
      batchSize,
      prober,
    })
      .toPromise()
      .then(() => {
        expect(prober).not.toBeCalled();
      });
  });

  it('should call prober once given input stream smaller than batch size', () => {
    const { batchSize, prober } = setup();

    return probinator(createHashedBlob$(1), {
      batchSize,
      prober,
    })
      .toPromise()
      .then(() => {
        expect(prober).toHaveBeenCalledTimes(1);
        expect(prober).toHaveBeenCalledWith([
          { blob: expect.any(Blob), hash: '0' },
        ]);
      });
  });

  it('should call prober twice given input stream just larger than batch size', () => {
    const { batchSize, prober } = setup();

    return probinator(createHashedBlob$(4), {
      batchSize,
      prober,
    })
      .toPromise()
      .then(() => {
        expect(prober).toHaveBeenCalledTimes(2);
        expect(prober).toHaveBeenCalledWith([
          { blob: expect.any(Blob), hash: '0' },
          { blob: expect.any(Blob), hash: '1' },
          { blob: expect.any(Blob), hash: '2' },
        ]);
        expect(prober).toHaveBeenCalledWith([
          { blob: expect.any(Blob), hash: '3' },
        ]);
      });
  });

  it('should set exists flag to true given prober returns true', () => {
    const { batchSize, prober } = setup(true);

    return probinator(createHashedBlob$(1), {
      batchSize,
      prober,
    })
      .pipe(
        tap((probedBlob) => {
          expect(probedBlob.exists).toEqual(true);
        }),
      )
      .toPromise();
  });

  it('should set exists flag to false given prober returns false', () => {
    const { batchSize, prober } = setup(false);

    return probinator(createHashedBlob$(1), {
      batchSize,
      prober,
    })
      .pipe(
        tap((probedBlob) => {
          expect(probedBlob.exists).toEqual(false);
        }),
      )
      .toPromise();
  });
});

function createHashedBlob$(count: number): Observable<HashedBlob> {
  return range(0, count).pipe(
    map((hash) => ({
      blob: new Blob([]),
      hash: hash.toString(),
    })),
  );
}
