import { measureRender } from '@atlaskit/editor-common';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import {
  isContentEmpty,
  measureContentRenderedPerformance,
  PerformanceMatrices,
} from '../../bridge';

jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  measureRender: jest.fn((_, callback) => {
    callback(1000);
  }),
}));

describe('MeasureContentRenderedPerformance', () => {
  const content: JSONDocNode = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'date',
            attrs: {
              timestamp: '1804966400002',
            },
          },
          {
            type: 'text',
            text: ' ',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
  const callback = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call measureRender when content is replaced', () => {
    measureContentRenderedPerformance(content, callback);

    expect(measureRender).toHaveBeenCalledWith(
      'ProseMirror Content Render Time',
      expect.anything(),
    );
  });

  it('should call callback with totalNodeSize and nodes when content is rendered', () => {
    measureContentRenderedPerformance(content, callback);

    expect(callback).toHaveBeenCalledWith(
      4,
      '{"paragraph":2,"date":1,"text":1}',
      1000,
    );
  });
});

describe('PerformanceMatrices', () => {
  it('should return duration', () => {
    jest.spyOn(performance, 'now').mockReturnValueOnce(1000);

    const performanceMatrices = new PerformanceMatrices();

    jest.spyOn(performance, 'now').mockReturnValueOnce(1100);

    expect(performanceMatrices.duration).toBe(100);
  });
});

describe('isContentEmpty', () => {
  it('should return false when the content is not empty', () => {
    const content: JSONDocNode = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
      ],
    };
    expect(isContentEmpty(content)).toBe(false);
  });

  it('should return true when the content is empty', () => {
    const content: JSONDocNode = {
      version: 1,
      type: 'doc',
      content: [],
    };
    expect(isContentEmpty(content)).toBe(true);
  });
});
