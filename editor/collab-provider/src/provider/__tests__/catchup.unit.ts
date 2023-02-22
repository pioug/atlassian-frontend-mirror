import { catchup } from '../catchup';
import { CatchupOptions } from '../../types';

describe('Catchup ', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should replace local document and version', async () => {
    const exampleDoc = JSON.stringify({ a: 'example' });
    const options: CatchupOptions = {
      getCurrentPmVersion: jest.fn().mockReturnValue(1),
      getUnconfirmedSteps: jest.fn().mockReturnValue(undefined),
      fetchCatchup: jest.fn().mockResolvedValue({
        doc: exampleDoc,
        stepMaps: [
          {
            ranges: [0, 1, 2],
            inverted: false,
          },
        ],
        version: 2,
      }),
      filterQueue: jest.fn(),
      updateDocumentWithMetadata: jest.fn(),
      applyLocalSteps: jest.fn(),
    };

    await catchup(options);
    expect(options.filterQueue).toBeCalled();
    expect(options.updateDocumentWithMetadata).toBeCalledWith({
      doc: JSON.parse(exampleDoc),
      version: 2,
      metadata: undefined,
      reserveCursor: true,
    });
  });

  it('Should replace local document and version when client version is ahead', async () => {
    const exampleDoc = JSON.stringify({ a: 'example' });
    const options: CatchupOptions = {
      getCurrentPmVersion: jest.fn().mockReturnValue(50),
      getUnconfirmedSteps: jest.fn().mockReturnValue(undefined),
      fetchCatchup: jest.fn().mockResolvedValue({
        doc: exampleDoc,
        stepMaps: [
          {
            ranges: [0, 1, 2],
            inverted: false,
          },
        ],
        version: 2,
      }),
      filterQueue: jest.fn(),
      updateDocumentWithMetadata: jest.fn(),
      applyLocalSteps: jest.fn(),
    };

    await catchup(options);
    expect(options.updateDocumentWithMetadata).toBeCalledWith({
      doc: JSON.parse(exampleDoc),
      version: 2,
      metadata: undefined,
      reserveCursor: true,
    });
  });
});
