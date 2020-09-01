import { validator } from '../../../validator';
import { ADFEntity } from '../../../types';

describe('Validator Errors', () => {
  const validate = validator();

  async function validateAndGetError(doc: ADFEntity) {
    return new Promise(resolve => {
      validate(doc, (entity, error) => {
        resolve(error);
        return entity;
      });
    });
  }

  it('UNSUPPORTED_ATTRIBUTES - unsupported node attribute', async () => {
    const error = await validateAndGetError({
      type: 'codeBlock',
      attrs: {
        redundant: true,
      },
    });

    expect(error).toMatchObject({
      code: 'UNSUPPORTED_ATTRIBUTES',
      meta: { redundant: true },
    });
  });

  it('MISSING_PROPERTIES ', async () => {
    const error = await validateAndGetError({
      type: 'emoji',
    });

    expect(error).toMatchObject({
      code: 'MISSING_PROPERTIES',
      meta: { props: ['attrs'] },
    });
  });

  it('REDUNDANT_PROPERTIES ', async () => {
    const error = await validateAndGetError({
      type: 'codeBlock',
      redundantProp: true,
    });

    expect(error).toMatchObject({
      code: 'REDUNDANT_PROPERTIES',
      meta: { props: ['redundantProp'] },
    });
  });

  it('UNSUPPORTED_ATTRIBUTES - unsupported node attribute value', async () => {
    const error = await validateAndGetError({
      type: 'emoji',
      attrs: { shortName: 'five', text: 5 },
    });

    expect(error).toMatchObject({
      code: 'UNSUPPORTED_ATTRIBUTES',
      message: `emoji: 'attrs' validation failed.`,
      meta: { text: 5 },
    });
  });

  it('INVALID_TYPE ', async () => {
    const error = await validateAndGetError({
      type: 'invalidType',
    });

    expect(error).toMatchObject({
      code: 'INVALID_TYPE',
    });
  });
});
