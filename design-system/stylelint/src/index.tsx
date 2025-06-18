import fs from 'fs';
import path from 'path';

const filepath = path.resolve(__dirname, './rules');

const rules = fs.readdirSync(filepath).map((folder) => require(`./rules/${folder}`).default);

export default rules;
