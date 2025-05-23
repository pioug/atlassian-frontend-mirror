import React from 'react';

import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import Link from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import SectionMessage from '@atlaskit/section-message';

import { default as FullPageExample } from './5-full-page';

const cardClient = new ConfluenceCardClient('staging');
const cardProvider = new ConfluenceCardProvider('staging');

const exampleDocument = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'blockCard',
			attrs: {
				__confluenceMetadata: {
					isRenamedTitle: true,
					linkType: 'self',
				},
				url: 'https://at-perfpm.jira-dev.com/browse/STJ-2',
			},
		},
		{
			type: 'blockCard',
			attrs: {
				url: 'https://pug.jira-dev.com/wiki/spaces/~kihlberg/pages/4210950327/Klaus+on+Leave+28th+of+June+to+28th+of+July',
			},
		},
	],
};

// put into separate constant because prettier can't handle // in JSX
const jdogURL = 'https://jdog.jira-dev.com/browse/BENTO-3922';

export function Example() {
	return (
		// We must wrap the <Editor> with a provider, passing cardClient via prop
		<SmartCardProvider client={cardClient}>
			<div>
				<SectionMessage title="Smart Cards in Confluence Editor">
					<p>
						Make sure you're logged into{' '}
						{fg('dst-a11y__replace-anchor-with-link__editor') ? (
							<Link
								href="https://pug.jira-dev.com"
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-no-target-blank
								target="_blank"
								rel="noreferrer"
							>
								Atlassian Cloud on Staging
							</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
							<a
								href="https://pug.jira-dev.com"
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-no-target-blank
								target="_blank"
								rel="noreferrer"
							>
								Atlassian Cloud on Staging
							</a>
						)}
						. Try pasting URLs to Hello, Google Drive, Asana, Dropbox, Trello etc. Links pasted in
						empty paragraphs will create a bigger, block card. Links pasted inside other elements
						(like lists, tables, panels) will be converted to a smaller, inline version of card. A
						gallery of available types of cards{' '}
						{fg('dst-a11y__replace-anchor-with-link__editor') ? (
							<Link href="/packages/linking-platform/smart-card/example/gallery">
								can be found here
							</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
							<a href="/packages/linking-platform/smart-card/example/gallery">can be found here</a>
						)}
					</p>
					<p>
						The mock macro provider will replace any JDOG issue link (e.g.
						{fg('dst-a11y__replace-anchor-with-link__editor') ? (
							<Link href={jdogURL}>{jdogURL}</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
							<a href={jdogURL}>{jdogURL}</a>
						)}
						) with a "jira" macro.
					</p>
				</SectionMessage>
				<FullPageExample
					editorProps={{
						defaultValue: exampleDocument,
						smartLinks: {
							// This is how we pass in the provider for smart cards
							provider: Promise.resolve(cardProvider),
							resolveBeforeMacros: ['jira'],
							allowBlockCards: true,
							allowEmbeds: true,
							allowResizing: true,
							allowDatasource: true,
						},
					}}
				/>
			</div>
		</SmartCardProvider>
	);
}

export default Example;
