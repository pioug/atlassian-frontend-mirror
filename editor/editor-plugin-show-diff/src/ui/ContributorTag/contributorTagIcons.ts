/**
 * The icons a contributor tag can draw, as inline SVG.
 *
 * Neither `@atlaskit/icon` nor `@atlaskit/icon-lab` exposes a raw-SVG entry
 * point, so the markup is copied here rather than kept as a React island for these glyphs. Keep in
 * sync with the sources named on each constant.
 */

/** `@atlaskit/icon/core/person`, at the 16px the avatar renders it. */
const PERSON_ICON_SVG = `<svg width="16" height="16" fill="none" viewBox="0 0 16 16" role="presentation" style="display:block"><path fill="currentcolor" fill-rule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clip-rule="evenodd"/></svg>`;

/** `@atlaskit/icon-lab/core/ai-bot`, at 12px so it fits inside the 16px hexagon. */
const AI_BOT_ICON_SVG = `<svg width="12" height="12" fill="none" viewBox="0 0 16 16" role="presentation" style="display:block"><path fill="currentcolor" d="M13 5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5zm-6.5 2v3H5v-3zm4.5 0v3H9.5v-3zm3.5 1H16V10h-1.5v3a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-3H0V8.5h1.5v-3a2 2 0 0 1 2-2h3.75v-2H4V0h4a.75.75 0 0 1 .75.75V3.5h3.75a2 2 0 0 1 2 2z"/></svg>`;

/**
 * The glyph from `@atlaskit/icon/core/ai-agent`, at 12px so it fits inside the 16px hexagon.
 * The icon package only exposes this as a React component; this tag is otherwise imperative DOM,
 * so keep the generated glyph here rather than introducing a React render boundary.
 */
const AI_AGENT_ICON_SVG = `<svg width="12" height="12" fill="none" viewBox="0 0 16 16" role="presentation" style="display:block"><path fill="currentcolor" fill-rule="evenodd" d="M6.971.493a2 2 0 0 1 2.058 0l5 3A2 2 0 0 1 15 5.208v5.584a2 2 0 0 1-.971 1.715l-5 3a2 2 0 0 1-2.058 0l-5-3A2 2 0 0 1 1 10.792V5.208a2 2 0 0 1 .971-1.715zm1.286 1.286a.5.5 0 0 0-.514 0l-5 3a.5.5 0 0 0-.243.429v5.584a.5.5 0 0 0 .243.429l1.098.66a4.25 4.25 0 1 1 8.318 0l1.098-.66a.5.5 0 0 0 .243-.429V5.208a.5.5 0 0 0-.243-.429zM8 8.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5" clip-rule="evenodd"/></svg>`;

export type ContributorTagIcon = 'aiAgent' | 'aiBot' | 'person';

const markup: Record<ContributorTagIcon, string> = {
	aiAgent: AI_AGENT_ICON_SVG,
	aiBot: AI_BOT_ICON_SVG,
	person: PERSON_ICON_SVG,
};

/**
 * Parsing the markup is the same work for every tag, so each icon is parsed once into a template
 * and cloned per use — appending a `DocumentFragment` moves its children out of it, so a shared
 * fragment would leave every icon after the first empty.
 */
const templates: Partial<Record<ContributorTagIcon, HTMLTemplateElement>> = {};

export const getContributorTagIcon = (
	icon: ContributorTagIcon,
	doc: Document,
): DocumentFragment => {
	let template = templates[icon];
	if (!template) {
		template = doc.createElement('template');
		template.innerHTML = markup[icon];
		templates[icon] = template;
	}

	return template.content.cloneNode(true) as DocumentFragment;
};
