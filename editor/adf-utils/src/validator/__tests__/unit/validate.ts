import * as fs from 'fs';
import { validator } from '../../../validator';
import waitForExpect from 'wait-for-expect';

const validate = validator();

declare var __dirname: string;
const BASE_DIR = `${__dirname}/../../../../../adf-schema/src/__tests__/unit/json-schema/v1-reference`;

const readFilesSync = (path: string) =>
  fs.readdirSync(path).reduce((acc: any[], name: string) => {
    if (name.match(/\.json$/)) {
      acc.push({
        name,
        data: JSON.parse(fs.readFileSync(`${path}/${name}`, 'utf-8')),
      });
    }
    return acc;
  }, [] as { name: string; data: any }[]);

describe('validate', () => {
  ['full', 'stage-0'].forEach((schemaType) => {
    let valid = [];
    try {
      valid = readFilesSync(`${BASE_DIR}/${schemaType}/valid`);
    } catch (e) {
      return;
    }
    valid.forEach((file: any) => {
      it(`${schemaType} schema validates '${file.name}'`, async () => {
        // Added because of expect.hasAssertions()
        expect(true).toBe(true);

        // TODO: Check why they are valid in ADF
        const ignoreList = [
          'paragraph-with-empty-marks.json',
          'codeBlock-with-empty-marks.json',
          'heading-with-empty-marks.json',
        ];
        if (!ignoreList.includes(file.name)) {
          const run = () => {
            validate(file.data);
          };
          await waitForExpect(() => {
            expect(run).not.toThrowError();
          });
        }
      });
    });

    let invalid = [];
    try {
      invalid = readFilesSync(`${BASE_DIR}/${schemaType}/invalid`);
    } catch (e) {
      return;
    }
    invalid.forEach((file: any) => {
      it(`${schemaType} schema does not validate '${file.name}'`, async () => {
        /**
         * Validator doesn't understand `stage-0` or `full`. It depends on the schema and specs
         * passed to it. Also, in spec we don't do any distinction between `stage-0` or `full`.
         * So, when we have test for things those are valid in `stage-0` but invalid in `full`.
         * We need to  include them here.
         * TODO: Configure the validate function according to schema
         */
        const ignoreList = [
          'taskList-with-taskList-as-first-child.json',
          'layout-with-embed.json',
          'heading-with-unknown-attrs.json',
          'mention-with-extra-attrs.json',
          'status-with-extra-attr.json',
          'codeBlock-with-unknown-attribute.json',
          'mention-with-invalid-user-type.json',
          'hardBreak-with-wrong-text.json',
          'mediaSingle-with-caption.json',
          'mediaInline.json',
          'mediaInline-with-link-mark.json',
          'media-with-link-mark.json',
          'extension-with-data-consumer-mark.json',
          'bodiedExtension-with-data-consumer-mark.json',
          'inlineExtension-with-data-consumer-mark.json',
          'layoutSection-with-one-column.json',
        ];

        /**
         * TODO: there is a "mutation bug" in the validator
         *
         * (see https://product-fabric.atlassian.net/browse/ED-12054?focusedCommentId=197447)
         */
        const expectAnyErrorList = [
          'extension-with-empty-local-id.json',
          'extension-with-invalid-local-id.json',
        ];
        expect(true).toBe(true);
        if (expectAnyErrorList.includes(file.name)) {
          const errorCb = jest.fn();
          validate(file.data, errorCb);
          /**
           * For now, work with the mutation bug & the assumptions that come
           * with it; namely,
           * - we should see the error callback to be called
           * - rather than the validation run to throw entirely
           *
           *  given we are testing for optional attributes.
           */
          expect(errorCb).toBeCalled();
        } else {
          if (!ignoreList.includes(file.name)) {
            const run = () => {
              validate(file.data);
            };
            await Promise.resolve();
            expect(run).toThrowError();
          }
        }
      });
    });
  });
});
