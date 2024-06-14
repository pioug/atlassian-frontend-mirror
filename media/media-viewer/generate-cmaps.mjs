#!/usr/bin/env zx
/* eslint-disable  */

import 'zx/globals';

const dirname = './cmaps-in';

await $`gzip ${dirname}/*`;

const promises = fs
	.readdirSync(dirname)
	.filter((name) => name.includes('bcmap'))
	.map(async (file, i) => {
		const contents = await fs.readFile(`${dirname}/${file}`);

		const encodedstring = Buffer.from(contents).toString('base64');
		const filename = file.slice(0, -9);
		const output = `export default "${encodedstring}";\n`;
		fs.writeFile(`cmaps/${filename}.ts`, output);
		return filename;
	});

const fileNames = await Promise.all(promises);

const content = fileNames.reduce((acc, val, i) => {
	return `${acc}
  "${val}": () => import(/* webpackChunkName: "@atlaskit-internal_media-cname-${val}" */ "./${val}"),`;
}, '');

const final = `export const cmap: Record<string, () => Promise<{ default: string }>> = {${content}
}\n`;

await fs.writeFile(`cmaps/index.ts`, final);
