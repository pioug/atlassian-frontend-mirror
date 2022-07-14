import { genericExtractPropsFromJSONLD } from '../../';

const defaultExtractorFunction = () => ({
  title: { text: 'default extractor function' },
});

const extractorPrioritiesByType = {
  Object: 0,
  Document: 5,
};

const extractorFunctionsByType = {
  Object: () => ({ title: { text: 'object extractor function' } }),
  Document: () => ({ title: { text: 'document extractor function' } }),
};

const defaultOptions = {
  defaultExtractorFunction,
  extractorPrioritiesByType,
  extractorFunctionsByType,
  json: {},
};

describe('genericExtractPropsFromJSONLD()', () => {
  it('should extract props using the default extractor function when json is undefined', () => {
    const options = {
      ...defaultOptions,
      json: undefined,
    };
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'default extractor function',
      },
    });
  });

  it('should extract props using the default extractor function when @type is undefined', () => {
    const options = defaultOptions;
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'default extractor function',
      },
    });
  });

  it('should extract props using the default extractor function when @type is not known', () => {
    const options = {
      ...defaultOptions,
      json: {
        '@type': 'foobar',
      },
    };
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'default extractor function',
      },
    });
  });

  it('should extract props using the extractor function for the type when type is known', () => {
    const options = {
      ...defaultOptions,
      json: {
        '@type': 'Object',
      },
    };
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'object extractor function',
      },
    });
  });

  it('should extract props using the highest priority extractor function for one of the types when type is an array and one of the types is known', () => {
    const options = {
      ...defaultOptions,
      json: {
        '@type': ['Object', 'Document'],
      },
    };
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'document extractor function',
      },
    });
  });

  it('should extract props using the default extractor function when type is an array and none of the types are known', () => {
    const options = {
      ...defaultOptions,
      json: {
        '@type': ['foo', 'bar'],
      },
    };
    expect(genericExtractPropsFromJSONLD(options)).toEqual({
      title: {
        text: 'default extractor function',
      },
    });
  });
});
