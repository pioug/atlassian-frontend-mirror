/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable new-cap */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
/* eslint-disable import/order */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const puppeteer = require('puppeteer');

if (process.env.NODE_ENV !== 'test') {
	require('@babel/register')({
		presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
		plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		ignore: [/node_modules/],
		only: [/.*\.tsx$/, /.*\.ts$/],
	});
}

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const DARK_PNG_EXTENSION = 'dark.png';
const LIGHT_PNG_EXTENSION = 'light.png';
const OUTPUT_DIR = 'reports';
const SCREENSHOT_DIR = `${OUTPUT_DIR}/screenshots`;

function isClass(variable) {
	if (typeof variable === 'function') {
		const functionAsString = variable.toString();
		// A class definition will start with "class " or "class{", accounting for minified code.
		return /^class\s/.test(functionAsString) || /^class{/.test(functionAsString);
	}
	return false;
}

const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/;
const findComponentsWithSVGs = async (dir) => {
	const relPath = path.join('../../../../', dir);
	const files = await globby([
		`${relPath}/**/*.jsx`,
		`${relPath}/**/*.tsx`,
		`${relPath}/**/*.svg`,
		'!packages/design-system/icon/**',
		'!packages/design-system/icon-lab/**',
		'!packages/design-system/icon-object/**',
		// 'packages/jql/jql-editor/src/plugins/autocomplete/components/autocomplete-option/glyphs.tsx'
	]);
	const components = [];
	const svgFiles = [];

	for (const file of files) {
		if (file.endsWith('.svg')) {
			svgFiles.push(file);
		} else {
			const content = fs.readFileSync(file, 'utf8');
			if (svgRegex.test(content)) {
				components.push(file);
			}
		}
	}
	return { components, svgFiles };
};

const isSvg = (exportedComponent) => {
	return (
		exportedComponent.toString().includes('createElement("svg"') ||
		exportedComponent.toString().includes('createElement(_icon.default')
	);
};
const getAllNamedExportsUsingSVG = (componentPath) => {
	const moduleExports = require(componentPath);

	let exportsArray = Object.keys(moduleExports).map((key) => moduleExports[key]);

	exportsArray = exportsArray.filter((exportedComponent) => {
		if (typeof exportedComponent === 'function') {
			if (exportedComponent.name === 'StyledComponent') return false;
			if (isSvg(exportedComponent)) return true;

			if (exportedComponent.toString().includes('createElement("svg"')) return true;
			if (!isClass(exportedComponent) && !exportedComponent()?.type?.displayName) return true;
			if (isClass(exportedComponent)) {
				const instance = new exportedComponent();
				if (instance.render().type === 'svg') {
					return true;
				}
				return false;
			}
			return false;
		}

		if (typeof exportedComponent === 'object' && exportedComponent.type === 'svg') {
			return true;
		}
		return false;
	});
	exportsArray = exportsArray.map((exportedComponent) => {
		if (typeof exportedComponent === 'function') {
			return exportedComponent;
		}

		return () => exportedComponent;
	});
	return exportsArray;
};

const renderComponents = (componentPath) => {
	const Components = getAllNamedExportsUsingSVG(componentPath);
	if (!Components.length) {
		throw new Error(`No valid exports found in ${componentPath}`);
	}
	const WrapperComponent = () =>
		React.createElement(
			React.Fragment,
			null,
			Components.map((Component, index) =>
				// eslint-disable-next-line react/no-array-index-key
				React.createElement(Component, { key: index }),
			),
		);
	return ReactDOMServer.renderToString(React.createElement(WrapperComponent));
};

const getSvgFileContent = (svgFilePath) => {
	const svgContent = fs.readFileSync(path.resolve(__dirname, svgFilePath), 'utf8');
	return svgContent;
};

const captureScreenshot = async (htmlContent, outputPath) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

	// Set background color
	await page.evaluate((color) => {
		document.body.style.backgroundColor = color;
	}, '#000000');

	// Query all SVG elements
	const svgs = await page.$$eval('svg', (s) =>
		s.map((svg) => {
			const rect = svg.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		}),
	);

	// Calculate total width and max height
	const totalWidth = Math.ceil(svgs.reduce((acc, svg) => acc + svg.width, 0));
	// const maxHeight = Math.ceil(Math.max(...svgs.map(svg => svg.height)));
	const maxHeight = Math.ceil(svgs.reduce((acc, svg) => acc + svg.height, 0));

	// Set viewport to total width and max height to capture all SVGs side by side
	await page.setViewport({ width: totalWidth + 20, height: maxHeight + 20, deviceScaleFactor: 2 });

	// Take screenshot
	await page.screenshot({ path: `${outputPath}_${DARK_PNG_EXTENSION}` });

	// Screen shot with white background
	await page.evaluate((color) => {
		document.body.style.backgroundColor = color;
	}, '#ffffff');

	await page.screenshot({ path: `${outputPath}_${LIGHT_PNG_EXTENSION}` });

	// Close browser
	await browser.close();
};

const captureAllScreenshots = async ({ files, packageName, result, hasSvgs = false }) => {
	for (const component of files) {
		const screenshotPath = `${SCREENSHOT_DIR}/${packageName}/svg_${result.length + 1}`;
		try {
			const componentHtml = hasSvgs ? getSvgFileContent(component) : renderComponents(component);
			await captureScreenshot(componentHtml, screenshotPath);
			console.log('SVG screenshot captured: ✅ ', component);
			result.push({
				file: component,
				screenshot: {
					dark: `../${screenshotPath}_${DARK_PNG_EXTENSION}`,
					light: `../${screenshotPath}_${LIGHT_PNG_EXTENSION}`,
				},
			});
		} catch (e) {
			console.log(e);
			console.log('Error while capturing screenshot: ❌ ', component);
			result.push({
				file: component,
			});
		}
	}
};

const generateHTMLReport = (components) => {
	const tableRows = components
		.map(
			(component) => `
        <tr>
            <td>${component.file.replace('../../../../', '')}</td>
            <td>
				${
					component.screenshot
						? `
					<img src="${component.screenshot.light}" alt="SVG light Screenshot" width="40">
				<img src="${component.screenshot.dark}" alt="SVG dark Screenshot" width="40">
				`
						: 'Not generated'
				}

			</td>

        </tr>
    `,
		)
		.join('');
	const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SVG Audit Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                img { max-width: 100%; height: auto; background-repeat: none; margin: 0 5px;}
            </style>
        </head>
        <body>
            <h1>SVG Audit Report</h1>
			<p>Total SVGs found: <strong>${components.length}<strong></p>
            <table>
                <thead>
                    <tr>
                        <th>File Path</th>
                        <th>SVG Screenshot</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
	return htmlContent;
};

const getPackageName = (targetDir) => targetDir.split('/')[targetDir.split('/').length - 1];

const createFolders = (targetDir) => {
	const packageName = getPackageName(targetDir);

	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR);
	}

	if (!fs.existsSync(SCREENSHOT_DIR)) {
		fs.mkdirSync(SCREENSHOT_DIR);
	}

	if (!fs.existsSync(`${SCREENSHOT_DIR}/${packageName}`)) {
		fs.mkdirSync(`${SCREENSHOT_DIR}/${packageName}`);
	}
};

const main = async () => {
	const targetDir = process.argv[2];
	if (!targetDir) {
		console.error('Please provide a directory or file path as an argument.');
		process.exit(1);
	}

	const { components, svgFiles } = await findComponentsWithSVGs(targetDir);
	console.log('------------- Components with SVGs -------------');
	console.log(components, svgFiles);
	console.log('------------- SVG files -------------');
	console.log(svgFiles);

	createFolders(targetDir);

	const packageName = getPackageName(targetDir);

	const componentsWithScreenshots = [];
	await captureAllScreenshots({
		files: components,
		packageName,
		result: componentsWithScreenshots,
	});

	await captureAllScreenshots({
		files: svgFiles,
		packageName,
		result: componentsWithScreenshots,
		hasSvgs: true,
	});

	if (!componentsWithScreenshots.length) {
		const hasNoScreenshots = componentsWithScreenshots.every((component) => !component.screenshot);
		if (hasNoScreenshots) fs.rmdirSync(`${SCREENSHOT_DIR}/${packageName}`, { recursive: true });
		console.error('No SVGs found in the provided directory.');
		process.exit(1);
	}
	const htmlReport = generateHTMLReport(componentsWithScreenshots);
	const htmlReportPath = path.join(OUTPUT_DIR, `${packageName}.html`);
	fs.writeFileSync(htmlReportPath, htmlReport);
	console.log(`SVG audit report generated: ${packageName}.html 💚`);
};

main().catch(console.error);

module.exports = {
	findComponentsWithSVGs,
	isSvg,
	getAllNamedExportsUsingSVG,
	renderComponents,
	getSvgFileContent,
	captureScreenshot,
	captureAllScreenshots,
	generateHTMLReport,
	getPackageName,
	createFolders,
	main,
};
