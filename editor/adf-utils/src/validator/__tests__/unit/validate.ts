import { validator } from '../../../validator';

import {
	fullValidJsonSchema,
	fullInvalidJsonSchema,
	stage0ValidJsonSchema,
	stage0InvalidJsonSchema,
} from '@atlassian/adf-schema-json';

const validate = validator();

describe('validate valid schema', () => {
	const ignoreList = [
		'paragraph-with-empty-marks.json',
		'codeBlock-with-empty-marks.json',
		'heading-with-empty-marks.json',
		'extension-with-empty-marks.json',
		// the following also have empty marks, which fails
		'nestedExpand-with-codeBlock.json',
		'panel-with-codeBlock.json',
		// is failing in master https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/3619620
		'list-item-with-decision.json',
	];
	const valid = fullValidJsonSchema.concat(stage0ValidJsonSchema);

	valid.forEach((file: any) => {
		it(`schema validates '${file.name}'`, async () => {
			// Added because of expect.hasAssertions()
			expect(true).toBe(true);

			// Ignored via go/ees007
			// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
			// TODO: These were mostly oversight, they don't have huge impact.
			// However we should update the validator to respect the same rule as ADF for this scenario.
			if (!ignoreList.includes(file.name)) {
				const run = () => {
					validate(file.data);
				};

				expect(run).not.toThrowError();
			}
		});
	});
});

describe('validate invalid schema', () => {
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	/**
	 * Validator doesn't understand `stage-0` or `full`. It depends on the schema and specs
	 * passed to it. Also, in spec we don't do any distinction between `stage-0` or `full`.
	 * So, when we have test for things those are valid in `stage-0` but invalid in `full`.
	 * We need to  include them here.
	 * TODO: Configure the validate function according to schema
	 */

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	/**
	 * TODO: there is a "mutation bug" in the validator
	 *
	 * (see https://product-fabric.atlassian.net/browse/ED-12054?focusedCommentId=197447)
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
		'media-with-link-mark.json',
		'layoutSection-with-one-column.json',
		'extension-with-named-fragment-mark.json',
		// to be removed after list inside blockquote is fully supported in PM Schema. See https://product-fabric.atlassian.net/browse/ED-21452
		'blockquote-with-list-inside.json',
		// to be removed after localId attr inside paragraph and heading is fully supported.
		'heading-with-invalid-local-id.json',
		'mention-with-invalid-local-id.json',
		'paragraph-with-invalid-local-id.json',
		// these should be allowed as we added localId attributes in adf-schema 50.0.0
		'blockQuote-with-attrs.json',
		'listItem-with-attrs.json',
		'rule-with-attrs.json',
	];
	const expectAnyErrorList = [
		'extension-with-empty-local-id.json',
		'extension-with-invalid-local-id.json',
	];

	const invalid = fullInvalidJsonSchema.concat(stage0InvalidJsonSchema);

	invalid.forEach((file: any) => {
		it(`schema does not validate '${file.name}'`, async () => {
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
