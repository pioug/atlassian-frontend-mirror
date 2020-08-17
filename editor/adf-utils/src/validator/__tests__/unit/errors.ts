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

  it('REDUNDANT_ATTRIBUTES ', async () => {
    const error = await validateAndGetError({
      type: 'codeBlock',
      attrs: {
        redundant: true,
      },
    });

    expect(error).toMatchObject({
      code: 'REDUNDANT_ATTRIBUTES',
      meta: { attrs: ['redundant'] },
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

  it('INVALID_ATTRIBUTES ', async () => {
    const error = await validateAndGetError({
      type: 'emoji',
      attrs: { shortName: 'five', text: 5 },
    });

    expect(error).toMatchObject({
      code: 'INVALID_ATTRIBUTES',
      meta: { attrs: ['text'] },
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
