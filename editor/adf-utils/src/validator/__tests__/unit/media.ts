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
});
