import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

// Structured docs are evaluated by the website in the browser, where Node's `path` is unavailable.
const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
	components: [
		{
			name: 'Card',
			description:
				'Smart Links enhance URLs into interactive previews, offering a contextualized experience within Atlassian products. They come in inline, block, and embed formats, respecting content permissions and compliance settings.',
			status: 'general-availability',
			import: {
				name: 'Card',
				package: '@atlaskit/smart-card/card/lazy',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use inline for a link in a sentence, block for a summary card, or embed to let people use the linked item without leaving the page.',
				'Configure the Smart Link client and check access for the current person. Keep the URL available when details are loading or cannot be retrieved.',
			],
			contentGuidelines: [
				'Keep the original URL available while resolved content is loading or unavailable; only render destinations that the host has validated.',
			],
			accessibilityGuidelines: [
				'Use descriptive link text for inline appearance; avoid generic "click here" or the raw URL when possible.',
				'Keep the link destination and accessible name clear; do not add a redundant focusable wrapper around the card’s own link or actions.',
				'Preserve the component’s loading, forbidden, and error states so permission and resolution changes remain perceivable.',
			],
			keywords: ['smart-card', 'card', 'smart link', 'inline', 'block', 'embed', 'link', 'preview'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Inline link in prose',
					description: 'Render a resolved inline card through a host-supplied client.',
					source: `${packagePath}/examples/ai/card-inline.tsx`,
				},
				{
					name: 'Card (appearance: block)',
					description:
						'Block appearance — card-style preview with detailed view of the linked material. In the editor this is referred to as the "Card".',
					source: `${packagePath}/examples/ai/card-block.tsx`,
				},
				{
					name: 'Card (appearance: inline)',
					description:
						'Inline appearance — link in text like a hyperlink. Use showHoverPreview for hover preview on inline Smart Links.',
					source: `${packagePath}/examples/ai/card-inline.tsx`,
				},
				{
					name: 'Card (appearance: embed)',
					description:
						'Embed appearance — linked content rendered in place. Requires a resolvable embed URL; not all links support embed.',
					source: `${packagePath}/examples/ai/card-embed.tsx`,
				},
			],
		},
		{
			name: 'HoverCard',
			description:
				'Hover cards can be used as a standalone component to wrap any React component and display information about a supplied URL when the user hovers over the child. Different actions are shown depending on the resource type.',
			status: 'general-availability',
			import: {
				name: 'HoverCard',
				package: '@atlaskit/smart-card/hover',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need a Smart Link preview on hover over a custom trigger (e.g. text, icon). For hover preview on inline Smart Links in body text, use Card with showHoverPreview instead.',
			],
			contentGuidelines: [
				'Keep preview details focused on the linked resource and avoid exposing data the viewer cannot access.',
			],
			accessibilityGuidelines: [
				'Provide a keyboard-accessible way to open the preview (e.g. focus or explicit trigger); do not rely on hover alone.',
				'Ensure the trigger element has an accessible name and role (e.g. link or button).',
				'Set the preview label or title id so assistive technology has an accessible name; preserve the component’s keyboard dismissal behavior.',
			],
			keywords: ['smart-card', 'hover card', 'hover', 'preview', 'smart link'],
			categories: ['linking', 'data-display', 'interaction'],
			examples: [
				{
					name: 'Hover card',
					description:
						'HoverCard wrapping a trigger element; shows Smart Link preview on hover. Requires staging login to resolve.',
					source: `${packagePath}/examples/ai/hover-card.tsx`,
				},
			],
		},
		{
			name: 'LinkUrl',
			description:
				'LinkUrl is a plain hyperlink (<a>) with a built-in safety check. Use it when you want to warn users if the link description looks like one URL but the actual destination is different.',
			status: 'general-availability',
			import: {
				name: 'LinkUrl',
				package: '@atlaskit/smart-card/link',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the link text might look like one URL but point elsewhere—e.g. user-generated or external links—so users get a warning before navigating.',
			],
			contentGuidelines: [
				'If link text resembles a URL, make sure it describes the actual destination; validate the destination before rendering user-provided links.',
			],
			accessibilityGuidelines: [
				'Use descriptive link text that indicates the destination or action; avoid exposing only the URL when possible.',
				'Ensure the safety-check warning (when link text and destination differ) is announced to screen readers.',
			],
			keywords: ['smart-card', 'link', 'url', 'safety', 'hyperlink'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Link URL',
					description:
						'Link safety: when link text looks like a URL but destination differs (warning) vs when text matches or is plain (no warning).',
					source: `${packagePath}/examples/ai/link-url.tsx`,
				},
			],
		},
		{
			name: 'SnippetBlock',
			description:
				'A Flexible UI block that presents a concise excerpt from the resolved resource.',
			status: 'general-availability',
			import: {
				name: 'SnippetBlock',
				package: '@atlaskit/smart-card/snippet-block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Place beneath the title and key details when an excerpt helps explain the linked item. Omit it when it repeats information already shown.',
			],
			contentGuidelines: [
				'Treat a remote excerpt as untrusted text; do not turn it into HTML or place unsanitized controls inside it.',
			],
			accessibilityGuidelines: [
				'Use a logical structure (e.g. heading hierarchy) so the card is navigable by assistive tech.',
				'Ensure all interactive elements inside blocks (links, buttons, actions) are focusable and have accessible names.',
			],
			keywords: [
				'smart-card',
				'flexible',
				'flexible card',
				'flexible ui',
				'blocks',
				'elements',
				'composable',
			],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Snippet block in a card',
					description:
						'Compose a short excerpt with a title and relevant metadata inside a host-provided Smart Card context.',
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'TitleBlock',
			description:
				'A block component for the Smart Link title row. Used inside a block Card to show title, icon, and optional metadata and actions.',
			status: 'general-availability',
			import: {
				name: 'TitleBlock',
				package: '@atlaskit/smart-card/title-block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Place first in a custom card. Use a concise title with the item name supplied by Smart Link data.',
			],
			contentGuidelines: [
				'Use concise titles from the resolved resource and retain a useful link destination while title data is loading or unavailable.',
			],
			accessibilityGuidelines: [
				'Ensure the title is exposed as a heading or has an accessible name so it is announced as the primary label for the card.',
				'If the title row icon conveys meaning, give it an accessible name (e.g. aria-label); otherwise mark as decorative.',
			],
			keywords: ['smart-card', 'title block', 'flexible', 'block'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Title block default',
					description:
						'TitleBlock with default props; title and icon come from the resolved link data.',
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'MetadataBlock',
			description:
				'A block component that displays a row of metadata elements (e.g. created by, due date, state) in a Smart Link.',
			status: 'general-availability',
			import: {
				name: 'MetadataBlock',
				package: '@atlaskit/smart-card/metadata-block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show a small set of details that help people identify or choose the linked item. Avoid putting every available field in one row.',
			],
			contentGuidelines: [
				'Order metadata by the decision it supports and use concise labels; omit values that do not apply rather than substituting misleading placeholders.',
			],
			accessibilityGuidelines: [
				'Ensure metadata is available to screen readers (e.g. not conveyed only by color or icon).',
				'Use a list or group with an accessible name if the metadata row has a specific purpose (e.g. "Contributors", "Dates").',
			],
			keywords: ['smart-card', 'metadata block', 'flexible', 'block', 'metadata'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Metadata block primary',
					description:
						'MetadataBlock with a primary row showing CollaboratorGroup and ModifiedOn elements.',
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'PreviewBlock',
			description: 'A block component that displays a preview image or media for the Smart Link.',
			status: 'general-availability',
			import: {
				name: 'PreviewBlock',
				package: '@atlaskit/smart-card/preview-block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Add a preview when the image helps identify the resource. Keep the title and key facts available as text because previews may be unavailable or inaccessible.',
			],
			contentGuidelines: [
				'Treat preview images and captions as remote resource content and keep important facts available outside the image.',
			],
			accessibilityGuidelines: [
				'If the preview image conveys information, provide meaningful alt text; if purely decorative, use alt="" or aria-hidden.',
				'Ensure no critical information is shown only in the preview; duplicate in text or metadata when needed.',
			],
			keywords: ['smart-card', 'preview block', 'flexible', 'block', 'preview', 'image'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Preview block default',
					description: "PreviewBlock showing the resolved link's preview image when available.",
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'FooterBlock',
			description:
				'A block component for the Smart Link footer, typically showing actions (e.g. copy, open, follow).',
			status: 'general-availability',
			import: {
				name: 'FooterBlock',
				package: '@atlaskit/smart-card/footer-block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Place only actions relevant to the task at the end of a block card; avoid duplicating the card’s primary open-link action.',
			],
			contentGuidelines: [
				'Use action labels that describe the user-visible outcome and avoid showing actions that are unavailable for the current resource.',
			],
			accessibilityGuidelines: [
				'Give each action button or control an accessible name (e.g. "Copy link", "Open in new tab") so purpose is clear to screen readers.',
				'Ensure actions are keyboard operable and appear in a logical tab order.',
			],
			keywords: ['smart-card', 'footer block', 'flexible', 'block', 'actions'],
			categories: ['linking', 'data-display', 'interaction'],
			examples: [
				{
					name: 'Footer block default',
					description:
						'FooterBlock with default actions (e.g. copy, open, follow) at the bottom of the card.',
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'AssignedToElement',
			description: 'The person currently assigned to the linked resource.',
			status: 'general-availability',
			import: {
				name: 'AssignedToElement',
				package: '@atlaskit/smart-card/flexible/assigned-to-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to identify who is responsible for the next step; keep this distinct from the resource owner.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'assigned-to-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'AssignedToGroupElement',
			description: 'The group currently assigned to the linked resource.',
			status: 'general-availability',
			import: {
				name: 'AssignedToGroupElement',
				package: '@atlaskit/smart-card/flexible/assigned-to-group-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the assigned team when it helps people decide who should take the next step.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'assigned-to-group-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'AttachmentCountElement',
			description: 'The number of attachments associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'AttachmentCountElement',
				package: '@atlaskit/smart-card/flexible/attachment-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Show the attachment count when it helps people compare linked items.'],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'attachment-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'AuthorGroupElement',
			description: 'The authors associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'AuthorGroupElement',
				package: '@atlaskit/smart-card/flexible/author-group-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show authors when it matters who wrote the content. Keep authorship distinct from current ownership.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'author-group-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'ChecklistProgressElement',
			description: 'Checklist completion progress for the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ChecklistProgressElement',
				package: '@atlaskit/smart-card/flexible/checklist-progress-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Show checklist progress when it helps people decide what work remains.'],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'checklist-progress-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'CollaboratorGroupElement',
			description: 'People collaborating on the linked resource.',
			status: 'general-availability',
			import: {
				name: 'CollaboratorGroupElement',
				package: '@atlaskit/smart-card/flexible/collaborator-group-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when collaborators help readers understand active participation; avoid suggesting they are assignees.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'collaborator-group-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'CommentCountElement',
			description: 'The number of comments on the linked resource.',
			status: 'general-availability',
			import: {
				name: 'CommentCountElement',
				package: '@atlaskit/smart-card/flexible/comment-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the comment count when discussion activity helps people choose which item to open.',
			],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'comment-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'CreatedOnElement',
			description: 'The date the linked resource was created.',
			status: 'general-availability',
			import: {
				name: 'CreatedOnElement',
				package: '@atlaskit/smart-card/flexible/created-on-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the creation date when it helps distinguish an old resource from a recent one.',
			],
			contentGuidelines: ['Format relative or absolute dates consistently with the host locale.'],
			accessibilityGuidelines: [
				'Include enough context in the date label for screen reader users to understand that it is the creation date.',
			],
			keywords: ['smart-card', 'flexible ui', 'created-on-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'CreatedByElement',
			description: 'The person who created the linked resource.',
			status: 'general-availability',
			import: {
				name: 'CreatedByElement',
				package: '@atlaskit/smart-card/flexible/created-by-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the creator when knowing who created the item helps people understand its context.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'created-by-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'DueOnElement',
			description: 'The due date for the linked resource.',
			status: 'general-availability',
			import: {
				name: 'DueOnElement',
				package: '@atlaskit/smart-card/flexible/due-on-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use the due date when it changes what someone should do next.'],
			contentGuidelines: [
				'Format relative or absolute dates consistently with the host locale and make time-sensitive deadlines explicit.',
			],
			accessibilityGuidelines: [
				'Do not rely on color or relative phrasing alone to communicate an overdue or upcoming state.',
			],
			keywords: ['smart-card', 'flexible ui', 'due-on-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'LatestCommitElement',
			description: 'The latest commit associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'LatestCommitElement',
				package: '@atlaskit/smart-card/flexible/latest-commit-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the latest commit to show repository activity; omit it when a commit would not help someone assess the linked change.',
			],
			contentGuidelines: [
				'Commit messages come from repository content; preserve them as text and avoid exposing sensitive branch or author details unnecessarily.',
			],
			accessibilityGuidelines: [
				'Keep the commit summary readable as text; do not make a hash or icon the only way to identify the commit.',
			],
			keywords: ['smart-card', 'flexible ui', 'latest-commit-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'LinkIconElement',
			description: 'The provider icon associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'LinkIconElement',
				package: '@atlaskit/smart-card/flexible/link-icon-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the provider icon as a recognition cue alongside the resource name, not as a substitute for the name.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Treat the provider icon as decorative when the card already names the provider and linked resource.',
			],
			keywords: ['smart-card', 'flexible ui', 'link-icon-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'LocationElement',
			description: 'The location associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'LocationElement',
				package: '@atlaskit/smart-card/flexible/location-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show location when it helps distinguish a resource’s physical or organizational context.',
			],
			contentGuidelines: [
				'Confirm the linked resource is intended to expose its location, which may reveal sensitive context.',
			],
			accessibilityGuidelines: [
				'Render the location as text rather than relying on a map pin or other icon alone.',
			],
			keywords: ['smart-card', 'flexible ui', 'location-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'ModifiedByElement',
			description: 'The person who last modified the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ModifiedByElement',
				package: '@atlaskit/smart-card/flexible/modified-by-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to show the most recent editor when recent changes affect trust or follow-up.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'modified-by-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'ModifiedOnElement',
			description: 'The date the linked resource was last modified.',
			status: 'general-availability',
			import: {
				name: 'ModifiedOnElement',
				package: '@atlaskit/smart-card/flexible/modified-on-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use the modification date when recency matters to the decision.'],
			contentGuidelines: ['Format relative or absolute dates consistently with the host locale.'],
			accessibilityGuidelines: [
				'Include enough context in the date label for screen reader users to understand that it is the last-modified date.',
			],
			keywords: ['smart-card', 'flexible ui', 'modified-on-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'OwnedByElement',
			description: 'The person who owns the linked resource.',
			status: 'general-availability',
			import: {
				name: 'OwnedByElement',
				package: '@atlaskit/smart-card/flexible/owned-by-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to identify the person accountable for the resource; do not substitute it for the current assignee.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'owned-by-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'OwnedByGroupElement',
			description: 'The group that owns the linked resource.',
			status: 'general-availability',
			import: {
				name: 'OwnedByGroupElement',
				package: '@atlaskit/smart-card/flexible/owned-by-group-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to identify the owning team when accountability belongs to a group rather than a person.',
			],
			contentGuidelines: [
				'Names and avatar imagery may be missing or restricted; do not imply a person is responsible solely from an icon or position.',
			],
			accessibilityGuidelines: [
				'Keep visible name text available so avatar-only layouts do not hide identity from assistive technology.',
			],
			keywords: ['smart-card', 'flexible ui', 'owned-by-group-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-people.tsx`,
				},
			],
		},
		{
			name: 'PreviewElement',
			description: 'A preview of the linked resource.',
			status: 'general-availability',
			import: {
				name: 'PreviewElement',
				package: '@atlaskit/smart-card/flexible/preview-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a preview when its extra context helps people decide whether to open the resource.',
			],
			contentGuidelines: [
				'Preview text and media may contain user-authored content; keep it within the provider’s trust and privacy boundaries.',
			],
			accessibilityGuidelines: [
				'Keep the resource title and link available independently of preview media; ensure any preview controls have clear names.',
			],
			keywords: ['smart-card', 'flexible ui', 'preview-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'PriorityElement',
			description: 'The priority assigned to the linked resource.',
			status: 'general-availability',
			import: {
				name: 'PriorityElement',
				package: '@atlaskit/smart-card/flexible/priority-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use priority to help people decide what to address first, rather than as decoration on every card.',
			],
			contentGuidelines: [
				'Preserve the provider’s priority wording so labels such as “Highest” and “High” are not conflated.',
			],
			accessibilityGuidelines: [
				'Communicate priority in text; color or an icon alone is insufficient.',
			],
			keywords: ['smart-card', 'flexible ui', 'priority-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'ProgrammingLanguageElement',
			description: 'The programming language associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ProgrammingLanguageElement',
				package: '@atlaskit/smart-card/flexible/programming-language-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the language when it helps identify or filter a code resource; it is usually unnecessary on non-code links.',
			],
			contentGuidelines: [
				'Keep language names in their conventional spelling so they remain recognizable to developers.',
			],
			accessibilityGuidelines: [
				'Expose the language name as text, even when a language icon is also present.',
			],
			keywords: ['smart-card', 'flexible ui', 'programming-language-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'ProviderElement',
			description: 'The provider of the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ProviderElement',
				package: '@atlaskit/smart-card/flexible/provider-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the provider name when the destination is not already clear from the surrounding interface.',
			],
			contentGuidelines: [
				'Use the provider’s recognizable name rather than internal identifiers or hostnames.',
			],
			accessibilityGuidelines: [
				'Keep provider identity available as text when the logo is missing or cannot load.',
			],
			keywords: ['smart-card', 'flexible ui', 'provider-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'ReactCountElement',
			description: 'The number of reactions on the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ReactCountElement',
				package: '@atlaskit/smart-card/flexible/react-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the reaction count when feedback activity helps people compare linked items.',
			],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'react-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'ReadTimeElement',
			description: 'The estimated time to read the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ReadTimeElement',
				package: '@atlaskit/smart-card/flexible/read-time-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show estimated reading time when it helps someone choose what to read next.',
			],
			contentGuidelines: [
				'Label the value as an estimate so it is not mistaken for a guaranteed completion time.',
			],
			accessibilityGuidelines: [
				'Include the time unit in the text rather than announcing a bare number.',
			],
			keywords: ['smart-card', 'flexible ui', 'read-time-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'SentOnElement',
			description: 'The date the linked resource was sent.',
			status: 'general-availability',
			import: {
				name: 'SentOnElement',
				package: '@atlaskit/smart-card/flexible/sent-on-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the sent date when it helps readers understand the resource timeline.',
			],
			contentGuidelines: ['Format relative or absolute dates consistently with the host locale.'],
			accessibilityGuidelines: [
				'Include enough context in the date label for screen reader users to understand that it is the sent date.',
			],
			keywords: ['smart-card', 'flexible ui', 'sent-on-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'SnippetElement',
			description: 'A text excerpt from the linked resource.',
			status: 'general-availability',
			import: {
				name: 'SnippetElement',
				package: '@atlaskit/smart-card/flexible/snippet-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a snippet to help distinguish similarly titled resources; omit it when the excerpt adds no new context.',
			],
			contentGuidelines: [
				'Excerpts may include user-authored or private text; respect provider permissions and render the excerpt as text.',
			],
			accessibilityGuidelines: [
				'Keep excerpts concise and readable; do not truncate in a way that changes their meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'snippet-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'SourceBranchElement',
			description: 'The source branch associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'SourceBranchElement',
				package: '@atlaskit/smart-card/flexible/source-branch-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the source branch when reviewers need to distinguish where a change originates.',
			],
			contentGuidelines: [
				'Branch names can reveal work in progress; only display them where the viewer is permitted to see the repository.',
			],
			accessibilityGuidelines: [
				'Use a visible source label so the branch name is not ambiguous beside the target branch.',
			],
			keywords: ['smart-card', 'flexible ui', 'source-branch-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'StateElement',
			description: 'The current state of the linked resource.',
			status: 'general-availability',
			import: {
				name: 'StateElement',
				package: '@atlaskit/smart-card/flexible/state-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Use the current state when it changes what a reader should do next.'],
			contentGuidelines: [
				'Prefer the provider’s user-facing state label over internal status codes.',
			],
			accessibilityGuidelines: [
				'State must remain understandable without color or status iconography.',
			],
			keywords: ['smart-card', 'flexible ui', 'state-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'StoryPointsElement',
			description: 'The story-point estimate for the linked resource.',
			status: 'general-availability',
			import: {
				name: 'StoryPointsElement',
				package: '@atlaskit/smart-card/flexible/story-points-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show story points when the estimated effort helps people compare work items.',
			],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'story-points-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'SubTasksProgressElement',
			description: 'Subtask completion progress for the linked resource.',
			status: 'general-availability',
			import: {
				name: 'SubTasksProgressElement',
				package: '@atlaskit/smart-card/flexible/sub-tasks-progress-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show subtask progress when people need to see how much of the work is complete.',
			],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'sub-tasks-progress-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'SubscriberCountElement',
			description: 'The number of subscribers to the linked resource.',
			status: 'general-availability',
			import: {
				name: 'SubscriberCountElement',
				package: '@atlaskit/smart-card/flexible/subscriber-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show subscriber count when interest in an item helps people compare it with other results.',
			],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'subscriber-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'TargetBranchElement',
			description: 'The target branch associated with the linked resource.',
			status: 'general-availability',
			import: {
				name: 'TargetBranchElement',
				package: '@atlaskit/smart-card/flexible/target-branch-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show the target branch when reviewers need to confirm where a change will land.',
			],
			contentGuidelines: [
				'Branch names can reveal work in progress; only display them where the viewer is permitted to see the repository.',
			],
			accessibilityGuidelines: [
				'Label the target branch explicitly, especially when both source and target are shown.',
			],
			keywords: ['smart-card', 'flexible ui', 'target-branch-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'TitleElement',
			description: 'The title of the linked resource.',
			status: 'general-availability',
			import: {
				name: 'TitleElement',
				package: '@atlaskit/smart-card/flexible/title-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the resource title as the primary link label; avoid repeating it in adjacent metadata.',
			],
			contentGuidelines: [
				'Preserve enough of the provider title to distinguish the destination; do not substitute internal IDs.',
			],
			accessibilityGuidelines: [
				'Keep the title link descriptive when read out of context and avoid duplicate focusable links for the same destination.',
			],
			keywords: ['smart-card', 'flexible ui', 'title-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'ViewCountElement',
			description: 'The number of views of the linked resource.',
			status: 'general-availability',
			import: {
				name: 'ViewCountElement',
				package: '@atlaskit/smart-card/flexible/view-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Show view count when readership helps people choose what to open.'],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'view-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'VoteCountElement',
			description: 'The number of votes on the linked resource.',
			status: 'general-availability',
			import: {
				name: 'VoteCountElement',
				package: '@atlaskit/smart-card/flexible/vote-count-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Show vote count when the number of votes is relevant to the decision.'],
			contentGuidelines: [
				'Counts describe the available response and may not include items hidden by permissions; avoid treating a count as a complete inventory.',
			],
			accessibilityGuidelines: [
				'Expose the metric name with its value so a bare number is never the only announced meaning.',
			],
			keywords: ['smart-card', 'flexible ui', 'vote-count-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-progress.tsx`,
				},
			],
		},
		{
			name: 'CustomByAccessTypeElement',
			description: 'Custom text selected from the linked resource’s access state.',
			status: 'deprecated',
			import: {
				name: 'CustomByAccessTypeElement',
				package: '@atlaskit/smart-card/flexible/custom-by-access-type-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Deprecated alias. Prefer CustomElementByAccessType from @atlaskit/smart-card/custom-element-by-access-type for new integrations.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['smart-card', 'flexible ui', 'custom-by-access-type-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'CustomByStatusElement',
			description: 'Custom text selected from the linked resource’s state.',
			status: 'deprecated',
			import: {
				name: 'CustomByStatusElement',
				package: '@atlaskit/smart-card/custom-by-status-element',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Deprecated re-export. Use this only when maintaining existing imports; new integrations can import CustomByStatusElement from @atlaskit/smart-card/custom-by-status-element.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [],
			keywords: ['smart-card', 'flexible ui', 'custom-by-status-element'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible element group',
					description: 'Related elements rendered from host-resolved Smart Link data.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'CopyLinkAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'CopyLinkAction',
				package: '@atlaskit/smart-card/flexible/copy-link-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when people need to share the resolved resource URL; keep it alongside the primary link rather than replacing that link.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'copy-link-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'CustomAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'CustomAction',
				package: '@atlaskit/smart-card/flexible/custom-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for an app action such as opening an editor. Make the visible label describe what onClick will do.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'custom-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'DownloadAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'DownloadAction',
				package: '@atlaskit/smart-card/flexible/download-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show only when the current resource exposes a downloadable file and the viewer has permission to retrieve it.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'download-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'FollowAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'FollowAction',
				package: '@atlaskit/smart-card/flexible/follow-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show when the provider supports following this resource and the app can perform the follow/unfollow operation.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'follow-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'PreviewAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'PreviewAction',
				package: '@atlaskit/smart-card/flexible/preview-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the resource supports a larger in-product preview; omit it when opening a preview would not add useful context.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'preview-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'UnresolvedAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'general-availability',
			import: {
				name: 'UnresolvedAction',
				package: '@atlaskit/smart-card/flexible/unresolved-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use in an unresolved card state to retain the component’s built-in access or resolution recovery message.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'unresolved-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'CustomUnresolvedAction',
			description: 'A Flexible UI action for a Smart Link card.',
			status: 'deprecated',
			import: {
				name: 'CustomUnresolvedAction',
				package: '@atlaskit/smart-card/custom-unresolved-action',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Deprecated re-export. Migrate to CustomUnresolvedAction from @atlaskit/smart-card/custom-unresolved-action when custom access-state copy is needed.',
			],
			contentGuidelines: ['Use concise labels that describe the result.'],
			accessibilityGuidelines: [
				'Keep actions keyboard reachable, named, and in a predictable tab order.',
			],
			keywords: ['smart-card', 'flexible ui', 'action', 'custom-unresolved-action'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Flexible card actions',
					description:
						'Flexible actions alongside the card; replace illustrative custom behavior with an authorized host action.',
					source: `${packagePath}/examples/ai/flexible-actions.tsx`,
				},
			],
		},
		{
			name: 'Block',
			description: 'A Flexible UI block for host-owned supplemental content.',
			status: 'general-availability',
			import: {
				name: 'Block',
				package: '@atlaskit/smart-card/block',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for a short field that the built-in blocks cannot display. Place it with related card content.',
			],
			contentGuidelines: [
				'Render trusted, appropriately sanitized content; do not inject arbitrary HTML from link metadata.',
			],
			accessibilityGuidelines: [
				'Keep headings and controls semantic, and do not nest interactive controls inside the card’s primary link.',
			],
			keywords: ['smart-card', 'flexible ui', 'custom block'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Flexible blocks',
					description: 'A custom block composed with standard Smart Link blocks.',
					source: `${packagePath}/examples/ai/flexible-blocks.tsx`,
				},
			],
		},
		{
			name: 'CustomElementByAccessType',
			description:
				'A Flexible UI text element that selects content for the resource’s access state.',
			status: 'general-availability',
			import: {
				name: 'CustomElementByAccessType',
				package: '@atlaskit/smart-card/custom-element-by-access-type',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show help or next steps for different access states. Provide a fallback for states the app does not customize.',
			],
			contentGuidelines: [
				'Keep access instructions accurate for the current product and do not promise that a request has been submitted unless the host confirms it.',
			],
			accessibilityGuidelines: [
				'Use readable text that names the access state or next step; never rely on an icon or color alone.',
			],
			keywords: ['smart-card', 'access', 'custom text'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Access-state content',
					description:
						'Fallback copy inside a host-resolved Flexible UI card; state-specific text can be added when the host response supports it.',
					source: `${packagePath}/examples/ai/flexible-elements-resource.tsx`,
				},
			],
		},
		{
			name: 'Icon',
			description:
				'A Smart Link icon that can use a supplied icon node or resolved image URL and a fallback.',
			status: 'general-availability',
			import: {
				name: 'Icon',
				package: '@atlaskit/smart-card/icon',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use provider icons as recognition cues next to a descriptive resource name; keep the built-in or explicit fallback available when an image cannot load.',
			],
			contentGuidelines: [
				'Only render image URLs from trusted Smart Link provider data; avoid exposing arbitrary user-controlled image destinations.',
			],
			accessibilityGuidelines: [
				'Treat redundant provider imagery as decorative and keep the resource name or link text available to identify the destination.',
			],
			keywords: ['smart-card', 'icon', 'provider'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Icon with a fallback',
					description: 'A decorative link icon with the component fallback behavior.',
					source: `${packagePath}/examples/ai/icon.tsx`,
				},
			],
		},
		{
			name: 'CardSSR',
			description:
				'An SSR-compatible Smart Link card renderer for hosts that need server-rendered card markup.',
			status: 'general-availability',
			import: {
				name: 'CardSSR',
				package: '@atlaskit/smart-card/ssr',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use CardSSR to render Smart Links on the server. Use Card for client rendering. Pass a stable fallback title when a flexible block card must show the same text on the server and client.',
			],
			contentGuidelines: [
				'Keep the URL and title useful when provider data is unavailable during server rendering; do not embed private data in placeholder props.',
			],
			accessibilityGuidelines: [
				'Verify server and hydrated output keep the same link name and destination so assistive technology does not receive a changed label after hydration.',
			],
			keywords: ['smart-card', 'ssr', 'server rendering'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Server-compatible block card',
					description:
						'Render the SSR-specific component for a block link in a host server-rendered route.',
					source: `${packagePath}/examples/ai/card-ssr.tsx`,
				},
			],
		},
		{
			name: 'ExpandedFrame',
			description:
				'A frame used to present embedded content with a resource header and controlled overflow.',
			status: 'general-availability',
			import: {
				name: 'ExpandedFrame',
				package: '@atlaskit/smart-card/expanded-frame',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to build a custom embedded preview. Use Card with appearance="embed" for the complete Smart Link preview.',
				'Keep content scrollable when the link cannot be loaded so people can reach the account connection controls.',
			],
			contentGuidelines: [
				'Keep a meaningful resource title and a text fallback for embedded content that cannot load.',
			],
			accessibilityGuidelines: [
				'Ensure the header link has descriptive text and that embedded content does not disrupt the host page reading order.',
			],
			keywords: ['smart-card', 'embed', 'frame'],
			categories: ['linking', 'data-display'],
			examples: [
				{
					name: 'Embedded resource frame',
					description: 'A low-level frame with a clear resource title and scrollable content.',
					source: `${packagePath}/examples/ai/expanded-frame.tsx`,
				},
			],
		},
		{
			name: 'PreAuthValuePropositionModal',
			description:
				'A Smart Link modal that explains the value of connecting an external provider before authorization.',
			status: 'general-availability',
			import: {
				name: 'PreAuthValuePropositionModal',
				package: '@atlaskit/smart-card/pre-auth-value-proposition-modal',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Show for a link the person has not authorized, when the app settings and provider sign-in flow support this prompt. The component also limits how often it appears.',
			],
			contentGuidelines: [
				'Provider name and benefits come from Smart Link/provider data; confirm the metadata is appropriate to show and keep copy understandable when optional social proof is absent.',
			],
			accessibilityGuidelines: [
				'Preserve the modal title, Escape/close behavior, and focus management; do not bypass the host authorization flow.',
			],
			keywords: ['smart-card', 'authorization', 'modal', 'pre-auth'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'Host-gated provider connection prompt',
					description:
						'The host supplies feature eligibility and an unauthorized response; the component applies its own state and display rules.',
					source: `${packagePath}/examples/ai/pre-auth-value-proposition-modal.tsx`,
				},
			],
		},
	],
	hooks: [
		{
			name: 'useSmartLinkEvents',
			description:
				'Hook that returns a SmartLinkEvents object for dispatching analytics events for a given URL. Currently supports insertSmartLink.',
			status: 'general-availability',
			import: {
				name: 'useSmartLinkEvents',
				package: '@atlaskit/smart-card/hook/use-smart-link-events',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need to fire Smart Link analytics (e.g. insert events) from custom UI that is not the default Card.',
			],
			accessibilityGuidelines: [
				'Use analytics events to understand usage; ensure event wiring does not change focus, interrupt screen readers, or alter semantics.',
			],
			keywords: ['smart-card', 'hooks', 'analytics', 'useSmartLinkEvents', 'events'],
			categories: ['linking', 'analytics'],
			examples: [
				{
					name: 'Analytics',
					description:
						'Card with AnalyticsListener capturing and displaying Smart Link analytics events (e.g. on click).',
					source: `${packagePath}/examples/content/analytics.tsx`,
				},
			],
		},
		{
			name: 'useSmartLinkActions',
			description:
				'Hook that extracts and returns actions for a given URL. Relies on Smart Link context; usages must be wrapped in SmartCardProvider or equivalent.',
			status: 'general-availability',
			import: {
				name: 'useSmartLinkActions',
				package: '@atlaskit/smart-card/hook/use-smart-link-actions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when building custom action UI (buttons, menus) that should expose Smart Link actions (e.g. Preview, Open) for a given URL.',
			],
			accessibilityGuidelines: [
				'When rendering actions from this hook (e.g. buttons or menus), provide accessible labels (e.g. from action.text) and ensure keyboard support.',
			],
			keywords: ['smart-card', 'hooks', 'useSmartLinkActions', 'actions'],
			categories: ['linking', 'interaction'],
			examples: [
				{
					name: 'useSmartLinkActions',
					description:
						'useSmartLinkActions used to get actions for a URL and invoke one (e.g. Preview) from a custom button.',
					source: `${packagePath}/examples/content/useSmartLinkActions.tsx`,
				},
			],
		},
	],
};

export default documentation;
