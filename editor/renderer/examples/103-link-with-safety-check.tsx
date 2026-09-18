import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';

import { default as Renderer } from '../src/ui/Renderer';
import linksForSafetyCheckADF from './helper/links-for-safety-check.json';

export default function LinksWithSafetyCheck(): React.JSX.Element {
	return <Renderer document={linksForSafetyCheckADF as DocNode} appearance="full-page" />;
}
