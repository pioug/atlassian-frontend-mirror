import { validator } from '../../../validator';

const validate = validator();

describe('media', () => {
  it('should not throw for valid document', () => {
    const run = () => {
      validate({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  id: 'xyz',
                  type: 'file',
                  collection: 'SampleCollection',
                  width: 170,
                  height: 384,
                },
              },
            ],
          },
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should not throw for a valid media node', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: 'xyz',
          type: 'file',
          collection: 'SampleCollection',
          width: 170,
          height: 384,
        },
      });
    };
    expect(run).not.toThrowError();
  });

  it('should throw when attrs is missing', () => {
    const run = () => {
      validate({
        type: 'media',
      });
    };
    expect(run).toThrowError('media: required prop missing.');
  });

  it('should throw when id is empty', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: '',
          type: 'file',
          collection: 'SampleCollection',
        },
      });
    };
    expect(run).toThrowError(`media: 'attrs' validation failed.`);
  });

  it('should throw when id is missing', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          type: 'file',
          collection: 'SampleCollection',
        },
      });
    };
    expect(run).toThrowError(`media: 'attrs' validation failed.`);
  });

  it('should throw when type is missing', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: 'xyz',
          collection: 'SampleCollection',
        },
      });
    };
    expect(run).toThrowError(`media: 'attrs' validation failed.`);
  });

  it('should throw when type is wrong', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: 'xyz',
          type: 'zz',
          collection: 'SampleCollection',
        },
      });
    };
    expect(run).toThrowError(`media: 'attrs' validation failed.`);
  });

  it('should not throw when collection is empty', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: 'xyz',
          type: 'file',
          collection: '',
        },
      });
    };
    expect(run).not.toThrowError();
  });

  it('should throw when collection is missing', () => {
    const run = () => {
      validate({
        type: 'media',
        attrs: {
          id: 'xyz',
          type: 'file',
        },
      });
    };
    expect(run).toThrowError(`media: 'attrs' validation failed.`);
  });

  it('should throw when length of mediaSingle is too long', () => {
    const validateLength = validator(['doc', 'mediaSingle', 'media']);
    const run = () => {
      validateLength({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaSingle',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
              {
                type: 'caption',
                content: [
                  {
                    type: 'text',
                    text: 'Hello World!',
                  },
                ],
              },
            ],
          },
        ],
      });
    };
    expect(run).toThrowError(
      `mediaSingle: 'content' should have less than 1 child.`,
    );
  });

  // has to be skipped currently due to issue here
  // https://product-fabric.atlassian.net/wiki/spaces/TPT/pages/1922867184/Nodes+with+Multiple+Validation+Specs
  it.skip('should not throw when length of mediaSingle is valid', () => {
    const validateLength = validator([
      'doc',
      'mediaSingle',
      'media',
      'caption',
    ]);
    const run = () => {
      validateLength({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaSingle',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
              {
                type: 'caption',
                content: [
                  {
                    type: 'text',
                    text: 'Hello World!',
                  },
                ],
              },
            ],
          },
        ],
      });
    };
    expect(run).toReturn();
  });

  it('should not invoke INVALID_CONTENT_LENGTH error when media with caption is within list item', () => {
    const validateLength = validator([
      'caption',
      'doc',
      'text',
      'bulletList',
      'listItem',
      'mediaSingle',
      'media',
    ]);

    const errorCallbackFn = jest.fn();
    validateLength(
      {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'mediaSingle',
                    content: [
                      {
                        type: 'media',
                        attrs: {
                          type: 'file',
                          id: '1234',
                          collection: 'SampleCollection',
                        },
                      },
                      {
                        type: 'caption',
                        content: [
                          {
                            type: 'text',
                            text: 'Hello World!',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      errorCallbackFn,
    );
    expect(errorCallbackFn).not.toHaveBeenCalled();
  });

  it('should throw for invalid content in caption', () => {
    const run = () => {
      validate({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaSingle',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '1234',
                  collection: 'SampleCollection',
                },
              },
              {
                type: 'caption',
                content: [
                  {
                    type: 'text',
                    text: 'Hello World!',
                  },
                  {
                    marks: [
                      {
                        type: 'strong',
                      },
                      {
                        attrs: {
                          href: 'https://www.atlassian.com',
                        },
                        type: 'link',
                      },
                    ],
                    text: 'World!',
                    type: 'unknownTypeInline',
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });
    };
    expect(run).toThrowError(`unknownTypeInline: invalid content.`);
  });
});
