import { writeFileSync } from 'fs';
import { join, resolve } from 'path';

import { createSignedArtifact } from '@atlassian/codegen/signed-artifact';

import { overrides } from '../src/overrides';
import type { EntryPointConfig, PackageVoltReadiness } from '../src/types';
import { buildPackageNameIndex } from '../utils/build-package-name-index';
import { buildSubpathCandidates } from '../utils/build-subpath-candidates';
import { detectBarrels } from '../utils/detect-barrels';
import { loadVoltPresetPackageMap } from '../utils/load-volt-preset-packages';
import { locatePackage } from '../utils/locate-package';
import { applyPackageReadinessGate, mergeOverrides } from '../utils/merge-overrides';
import { resolvePackageMappings } from '../utils/resolve-package-mappings';
import {
	CODEGEN_COMMAND,
	serializeEntryPointsModule,
} from '../utils/serialize-entry-points-module';
import { serializePackageNamesModule } from '../utils/serialize-package-names-module';
import { type MappingViolation, validateMappings } from '../utils/validate-mappings';

function main(): void {
	const packageRoot = resolve(__dirname, '..');
	const platformPackagesRoot = resolve(packageRoot, '../..');
	const afmRoot = resolve(platformPackagesRoot, '../..');
	const packagesOutputPath = join(packageRoot, 'src/package-names.codegen.tsx');
	const outputPath = join(packageRoot, 'src/entry-points.codegen.tsx');

	const packageNames = loadVoltPresetPackageMap(afmRoot);
	const packagesSource = serializePackageNamesModule(packageNames);
	const packagesSigned = createSignedArtifact(packagesSource, CODEGEN_COMMAND, {
		description: 'Volt Stage 1 / Stage 2 readiness map derived from volt-preset-packages.json.',
		// Intentionally omit the preset JSON: readiness can lag behind debarrel work, and
		// hashing it would force every voltCompliant flip to regenerate this package.
		dependencies: [],
		outputFolder: join(packageRoot, 'src'),
	});
	writeFileSync(packagesOutputPath, packagesSigned, 'utf8');

	const nameIndex = buildPackageNameIndex(platformPackagesRoot);
	const generated: EntryPointConfig = {};

	for (const [packageName, readiness] of Object.entries(packageNames)) {
		generated[packageName] = generatePackageConfig(packageName, readiness, nameIndex);
	}

	const merged = applyPackageReadinessGate(mergeOverrides(generated, overrides), packageNames);

	// The Stage 2 rule autofixes on save, so an unreachable mapping would rewrite working
	// code into a broken import. Fail the build rather than emit one.
	assertMappingsResolve(merged, nameIndex);

	const source = serializeEntryPointsModule(merged);
	const signed = createSignedArtifact(source, CODEGEN_COMMAND, {
		description: 'Volt component entry-point migration map for linting, ratcheting, and codemods.',
		// Track the generated readiness map only. Overrides are merged and validated at
		// generate-time, but intentionally omitted because this tooling is user-maintained.
		dependencies: [packagesOutputPath],
		outputFolder: join(packageRoot, 'src'),
	});

	writeFileSync(outputPath, signed, 'utf8');
}

function assertMappingsResolve(merged: EntryPointConfig, nameIndex: Map<string, string>): void {
	const { checked, skipped, violations } = validateMappings(merged, nameIndex);

	// eslint-disable-next-line no-console
	console.log(
		'Validated ' +
			String(checked) +
			' mapped symbols (' +
			String(skipped) +
			' skipped: entry-point uses `export *`)',
	);

	if (violations.length === 0) {
		return;
	}

	throw new Error(
		'Entry-point validation failed for ' +
			String(violations.length) +
			' symbol(s):\n' +
			violations.map(formatViolation).join('\n'),
	);
}

function formatViolation(violation: MappingViolation): string {
	const barrel = violation.packageName + violation.barrelKey;
	return (
		'  ' +
		barrel +
		' → ' +
		violation.symbolName +
		' mapped to ' +
		violation.packageName +
		violation.entryPoint +
		': ' +
		violation.reason
	);
}

function generatePackageConfig(
	packageName: string,
	readiness: PackageVoltReadiness,
	nameIndex: Map<string, string>,
): EntryPointConfig[string] {
	const pkg = locatePackage(packageName, nameIndex);
	if (!pkg) {
		return {};
	}

	const barrels = detectBarrels(pkg);
	if (barrels.length === 0) {
		return {};
	}

	const barrelKeys = barrels.map((barrel) => barrel.barrelKey);
	const candidates = buildSubpathCandidates(pkg, barrelKeys);
	return resolvePackageMappings(pkg, barrels, candidates, readiness).barrelMap;
}

main();
