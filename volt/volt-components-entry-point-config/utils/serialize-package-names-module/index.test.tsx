import { serializePackageNamesModule } from '../serialize-package-names-module';

describe('serializePackageNamesModule', () => {
	it('emits a const map from package readiness data', () => {
		const source = serializePackageNamesModule({
			'@atlaskit/flag': { voltCompliant: true, consumersMigrated: false },
			'@atlaskit/button': { voltCompliant: false, consumersMigrated: false },
			'@atlaskit/spinner': { voltCompliant: true, consumersMigrated: true },
		});

		expect(source).toContain(
			"'@atlaskit/button': { voltCompliant: false, consumersMigrated: false }",
		);
		expect(source).toContain("'@atlaskit/flag': { voltCompliant: true, consumersMigrated: false }");
		expect(source).toContain(
			"'@atlaskit/spinner': { voltCompliant: true, consumersMigrated: true }",
		);
		expect(source).toContain('export const PACKAGE_NAMES = {');
		expect(source).toContain('} as const;');
	});
});
