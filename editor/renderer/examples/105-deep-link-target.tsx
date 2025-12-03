import React from 'react';
import RendererDemo from './helper/RendererDemo';
import deepLinkTestADF from './helper/deep-link-test.adf.json';

/**
 * Static example demonstrating deep link target functionality.
 *
 * This example sets deepLinkTarget="jira", so:
 * - Links with ?deepLinkTarget=jira will open normally
 * - Links with ?deepLinkTarget=confluence will open in new tab
 * - Links with ?deepLinkTarget=admin will open in new tab
 * - Links without deepLinkTarget query param will open normally
 */
export default function DeepLinkTargetExample() {
	return (
		<RendererDemo
			serializer="react"
			document={deepLinkTestADF}
			onSetLinkTarget={(url) => {
				if (url.includes('deepLinkTarget=jira')) {
					return undefined; // open normally
				}
				return '_blank'; // open in new tab
			}}
			appearance="full-page"
		/>
	);
}
