import { catchup, CatchupOptions } from '../catchup';

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
      fitlerQueue: jest.fn(),
      updateDocumentWithMetadata: jest.fn(),
      applyLocalsteps: jest.fn(),
    };

    await catchup(options);
    expect(options.fitlerQueue).toBeCalled();
    expect(options.updateDocumentWithMetadata).toBeCalledWith({
      doc: JSON.parse(exampleDoc),
      version: 2,
      metadata: undefined,
      reserveCursor: true,
    });
  });
});
