import type { Format } from 'style-dictionary';

import { figmaFormatter } from './figma-formatter';

const fileFormatter: Format['formatter'] = (args) => figmaFormatter(args);

export default fileFormatter;
