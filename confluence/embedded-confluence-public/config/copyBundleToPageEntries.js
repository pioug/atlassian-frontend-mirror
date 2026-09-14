const fs = require('fs');
const path = require('path');

const BUNDLE_FILENAME = 'embedded-confluence-bundle.js';

// AFM generateEntryPoints maps "./page": "./src/page/index.tsx" to these dist files.
const PAGE_ENTRY_COPIES = ['cjs/page/index.js', 'esm/page/index.js', 'es2019/page/index.js'];

function copyBundleToPageEntries(distDir) {
	const source = path.join(distDir, BUNDLE_FILENAME);
	if (!fs.existsSync(source)) {
		throw new Error(`Missing ${BUNDLE_FILENAME} in ${distDir}`);
	}

	const contents = fs.readFileSync(source);
	for (const relativePath of PAGE_ENTRY_COPIES) {
		const destination = path.join(distDir, relativePath);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, contents);
	}
}

module.exports = {
	BUNDLE_FILENAME,
	PAGE_ENTRY_COPIES,
	copyBundleToPageEntries,
};
