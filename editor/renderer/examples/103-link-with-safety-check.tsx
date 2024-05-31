import React from 'react';
import { default as Renderer } from '../src/ui/Renderer';
import linksForSafetyCheckADF from './helper/links-for-safety-check.json';

export default function LinksWithSafetyCheck() {
	return <Renderer document={linksForSafetyCheckADF} appearance="full-page" />;
}
