import type { Metadata, MetadataStep } from '../transform-override';
import { Step } from '../transform';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

type TestMetadataStep = Step & {
	metadata: Metadata & { testField?: string };
};

describe('prosemirror-transform-override', () => {
	it('should still transform steps without Metadata as expected', () => {
		const json = { stepType: 'replace', to: 15, from: 10 };
		const parsedStep = Step.fromJSON(defaultSchema, json);
		const expectedStep = {
			stepType: 'replace',
			to: 15,
			from: 10,
		};
		expect(parsedStep.toJSON()).toEqual(expectedStep);
	});

	it('should preserve metadata when converting toJSON', () => {
		const json = {
			stepType: 'replace',
			to: 15,
			from: 10,
			metadata: { source: 'synchrony-reconcile' },
		};
		const parsedStep = Step.fromJSON(defaultSchema, json) as MetadataStep;
		const unparsedStep = parsedStep.toJSON();
		expect(unparsedStep).toEqual({
			from: 10,
			to: 15,
			stepType: 'replace',
			metadata: { source: 'synchrony-reconcile' },
		});
	});

	it('should preserve class metadata when converting toJSON', () => {
		const json = {
			stepType: 'replace',
			to: 15,
			from: 10,
		};
		const parsedStep = Step.fromJSON(defaultSchema, json) as TestMetadataStep;
		parsedStep.metadata = { testField: 'Im a test' };
		const unparsedStep = parsedStep.toJSON();
		expect(unparsedStep).toEqual({
			from: 10,
			to: 15,
			stepType: 'replace',
			metadata: { testField: 'Im a test' },
		});
	});

	it('should preserve class metadata when converting toJSON and json metadata is present', () => {
		const json = {
			stepType: 'replace',
			to: 15,
			from: 10,
			metadata: { source: 'synchrony' },
		};
		const parsedStep = Step.fromJSON(defaultSchema, json) as TestMetadataStep;
		parsedStep.metadata = { testField: 'Im a test' };
		const unparsedStep = parsedStep.toJSON();
		expect(unparsedStep).toEqual({
			from: 10,
			to: 15,
			stepType: 'replace',
			metadata: { testField: 'Im a test', source: 'synchrony' },
		});
	});

	it('should preserve data when converting toJSON and metadata is not present', () => {
		const json = {
			stepType: 'replace',
			to: 15,
			from: 10,
		};
		const parsedStep = Step.fromJSON(defaultSchema, json) as MetadataStep;
		const unparsedStep = parsedStep.toJSON();
		expect(unparsedStep).toEqual({
			from: 10,
			to: 15,
			stepType: 'replace',
		});
	});
});
