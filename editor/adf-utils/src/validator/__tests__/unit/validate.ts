import {
	fullInvalidJsonSchema,
	fullValidJsonSchema,
	stage0InvalidJsonSchema,
	stage0ValidJsonSchema,
} from '@atlassian/adf-schema-json';

import { validator } from '../../validator';

describe('validate full schema', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		validate = validator();
	});

	describe('valid scenarios', () => {
		const ignoreList: string[] = [];

		fullValidJsonSchema.forEach((file) => {
			it(`schema validates '${file.name}'`, async () => {
				// Added because of expect.hasAssertions()
				expect(true).toBe(true);

				if (!ignoreList.includes(file.name)) {
					const run = () => {
						validate(file.data);
					};
					expect(run).not.toThrow();
				}
			});
		});
	});

	describe('invalid scenarios', () => {
		const ignoreList: string[] = [];

		fullInvalidJsonSchema.forEach((file) => {
			it(`schema does not validate '${file.name}'`, () => {
				expect(true).toBe(true);
				if (!ignoreList.includes(file.name)) {
					const run = () => {
						validate(file.data);
					};
					expect(run).toThrow();
				}
			});
		});
	});
});

describe('validate stage0 schema', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		validate = validator(undefined, undefined, { stage0: true });
	});

	describe('valid scenarios', () => {
		const ignoreList: string[] = [];

		stage0ValidJsonSchema.forEach((file) => {
			it(`schema validates '${file.name}'`, async () => {
				// Added because of expect.hasAssertions()
				expect(true).toBe(true);

				if (!ignoreList.includes(file.name)) {
					const run = () => {
						validate(file.data);
					};
					expect(run).not.toThrow();
				}
			});
		});
	});

	describe('invalid scenarios', () => {
		const ignoreList: string[] = [];

		stage0InvalidJsonSchema.forEach((file) => {
			it(`schema does not validate '${file.name}'`, () => {
				// Added because of expect.hasAssertions()
				expect(true).toBe(true);
				if (!ignoreList.includes(file.name)) {
					const run = () => {
						validate(file.data);
					};
					expect(run).toThrow();
				}
			});
		});
	});
});
