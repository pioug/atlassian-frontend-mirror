import { editorExperimentsConfig } from '../experiments-config';

describe('Editor Config', () => {
	it.each(Object.keys(editorExperimentsConfig))(
		`should have defaultValue matching typeGuard for experiment: %s`,
		(experimentName) => {
			const { defaultValue, typeGuard } =
				editorExperimentsConfig[experimentName as keyof typeof editorExperimentsConfig];
			expect(typeGuard(defaultValue)).toBe(true);
		},
	);
});
