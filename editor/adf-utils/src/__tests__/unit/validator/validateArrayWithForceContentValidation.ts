import { ADFEntity } from '../../../types';
import { validator } from '../../../validator';

jest.mock('../../../validator/specs', () => {
  return {
    fakeParagraph: {
      props: {
        type: { type: 'enum', values: ['fakeParagraph'] },
        attrs: {
          props: {
            defaultMarks: {
              type: 'array',
              items: [['strong', 'textColor']],
              forceContentValidation: true,
            },
          },
        },
      },
    },
    fakeHeader: {
      props: {
        type: { type: 'enum', values: ['fakeHeader'] },
        attrs: {
          props: {
            defaultMarks: {
              type: 'array',
              items: [['code']],
              forceContentValidation: true,
              optional: true,
            },
            layout: {
              type: 'enum',
              values: ['wide', 'full-width', 'default'],
              optional: true,
            },
          },
        },
      },
    },
    code: { props: { type: { type: 'enum', values: ['code'] } } },
    strong: { props: { type: { type: 'enum', values: ['strong'] } } },
    em: { props: { type: { type: 'enum', values: ['em'] } } },
    textColor: {
      props: {
        type: { type: 'enum', values: ['textColor'] },
        attrs: {
          props: { color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } },
        },
      },
    },
  };
});

describe('validate attrs', () => {
  describe('when forceContentValidation is true', () => {
    const validate = validator(
      ['fakeParagraph', 'fakeHeader', 'code'],
      ['em', 'textColor', 'strong'],
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should validate content with multiple marks when multiple marks are allowed', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'strong',
              },
              {
                type: 'textColor',
                attrs: {
                  color: '#c1c1c1',
                },
              },
            ],
          },
        });
      };

      expect(run).not.toThrowError();
    });

    it('should validate content with one mark when multiple marks are allowed', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'strong',
              },
            ],
          },
        });
      };

      expect(run).not.toThrowError();
    });

    it('should not throw exception for valid textColor mark', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'textColor',
                attrs: {
                  color: '#c1c1c1',
                },
              },
            ],
          },
        });
      };

      expect(run).not.toThrowError();
    });

    it('should not throw exception for valid node', () => {
      const run = () => {
        validate({
          type: 'fakeHeader',
          attrs: {
            defaultMarks: [
              {
                type: 'code',
              },
            ],
          },
        });
      };

      expect(run).not.toThrowError();
    });

    it('should not throw exception when the forceContentValidation is not defined', () => {
      const run = () => {
        validate({
          type: 'fakeHeader',
          attrs: {
            layout: 'wide',
          },
        });
      };

      expect(run).not.toThrowError();
    });

    it('should throw exception for invalid content node', () => {
      const run = () => {
        validate({
          type: 'fakeHeader',
          attrs: {
            defaultMarks: [
              {
                type: 'not-code',
              },
            ],
          },
        });
      };

      expect(run).toThrowError();
    });

    it('should throw exception for invalid textColor', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'textColor',
                attrs: {
                  color: 'INVALID_COLOR',
                },
              },
            ],
          },
        });
      };

      expect(run).toThrowError();
    });

    it('should throw an exception when the mark is not allowed', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'em',
              },
            ],
          },
        });
      };

      expect(run).toThrowError('em: type not allowed here.');
    });

    it('should throw an exception when the mark does not exist', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'notValidMark',
              },
            ],
          },
        });
      };

      expect(run).toThrowError('notValidMark: type not allowed here.');
    });

    it('should not throw an exception when is empty', () => {
      const run = () => {
        validate({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [],
          },
        });
      };

      expect(run).not.toThrowError();
    });

    describe('replace attrs after validation', () => {
      it('should not change on the original entity reference', () => {
        const cb = () => undefined;
        const badEntity = {
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'notValidMark',
              },
            ],
          },
        };

        const run = () => {
          return validate(badEntity, cb);
        };

        run();
        expect(badEntity).toEqual({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'notValidMark',
              },
            ],
          },
        });
      });

      it('should remove entity when the callback return undefined', () => {
        const cb = () => undefined;
        const badEntity = {
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'notValidMark',
              },
            ],
          },
        };

        const run = () => {
          return validate(badEntity, cb);
        };

        const result = run();
        expect(result.entity).toEqual({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [],
          },
        });
      });

      it('should replace entity with new entity if returned from callback', () => {
        const cb = (entity: ADFEntity) => {
          if (entity.type === 'notValidMark') {
            return { type: 'strong' } as ADFEntity;
          }
          return undefined;
        };
        const badEntity = {
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'notValidMark',
              },
            ],
          },
        };

        const run = () => {
          return validate(badEntity, cb);
        };

        const result = run();
        expect(result.entity).toEqual({
          type: 'fakeParagraph',
          attrs: {
            defaultMarks: [
              {
                type: 'strong',
              },
            ],
          },
        });
      });
    });
  });
});
