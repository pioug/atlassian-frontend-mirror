import { validator } from '../../../validator';

describe('validate', () => {
  const validate = validator();

  it('should throw when required attrs are missing', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
      });
    };
    expect(run).toThrowError('doc: required prop missing.');
  });

  it('should not throw on private redundant attributes', () => {
    const validate = validator(undefined, undefined, {
      allowPrivateAttributes: true,
    });
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          { type: 'heading', content: [], attrs: { level: 1, __extra: true } },
        ],
      });
    };
    expect(run).not.toThrow();
  });

  it('should throw for invalid content', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'hello' }],
              },
            ],
          },
        ],
      });
    };
    expect(run).toThrowError('doc: invalid content.');
  });

  it('should be able to validate attrs with union type - path-1', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'blockCard',
            attrs: {
              url: 'https://docs.google.com/spreadsheets/d/xyz',
            },
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should be able to validate attrs with union type - path-2', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'blockCard',
            attrs: {
              data: { x: 10, y: 20 },
            },
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should throw when required attrs are missing inside children', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
          },
        ],
      });
    };
    expect(run).toThrowError('heading: required prop missing.');
  });

  it('should not throw when required attrs are available', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should not throw for valid document', () => {
    const doc = {
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
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Um',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const run = () => {
      const { entity } = validate(doc);
      expect(entity).toEqual(doc);
    };
    expect(run).not.toThrowError();
  });

  it('should be able to wrap invalid nodes', () => {
    const invalidNode = {
      type: 'tet',
      text: ' world!',
    };
    const invalidDoc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
            invalidNode,
            {
              type: 'text',
              text: 'World!',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    };

    const run = () => {
      const result = validate(invalidDoc, (x) => {
        expect(x).not.toBe(invalidNode);
        expect(x).toEqual(invalidNode);
        return {
          type: 'unknown',
          attrs: {
            originalNode: x,
          },
        };
      });
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
    expect(invalidDoc).toMatchSnapshot();
  });

  it('should not remove valid marks', () => {
    const doc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [
                {
                  type: 'code',
                },
              ],
            },
          ],
        },
      ],
    };

    const run = () => {
      const result = validate(doc, (_) => undefined);
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
    expect(doc).toMatchSnapshot();
  });

  it('should be able to wrap invalid nodes - 2', () => {
    const invalidDoc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Foo',
              marks: [
                {
                  type: 'code',
                },
                {
                  type: 'underline',
                },
              ],
            },
          ],
        },
      ],
    };

    const run = () => {
      const result = validate(invalidDoc, (x) => {
        return {
          type: 'unknown',
          attrs: {
            originalNode: x,
          },
        };
      });
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
    expect(invalidDoc).toMatchSnapshot();
  });
});

describe('validator', () => {
  it('should take custom list of nodes', () => {
    const validate = validator(['doc']);

    const invalidNode = {
      type: 'paragraph',
      content: [],
    };
    const invalidDoc = {
      version: 1,
      type: 'doc',
      content: [invalidNode],
    };

    const run = () => {
      const result = validate(invalidDoc, (x) => {
        expect(x).not.toBe(invalidNode);
        expect(x).toEqual(invalidNode);
        return {
          type: 'unknown',
          attrs: {
            originalNode: x,
          },
        };
      });
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
  });
});
