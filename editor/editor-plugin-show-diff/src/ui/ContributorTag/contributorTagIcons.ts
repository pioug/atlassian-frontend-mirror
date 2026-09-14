/**
 * The icons a contributor tag can draw, as inline SVG.
 *
 * Neither `@atlaskit/icon`, `@atlaskit/icon-lab` nor `@atlaskit/logo` exposes a raw-SVG entry
 * point, so the markup is copied here rather than kept as a React island for these glyphs. Keep in
 * sync with the sources named on each constant.
 *
 * The Rovo hex is the `brand` appearance, whose `--rovo-*-color` variables resolve to `initial` in
 * both themes — the fallbacks below are the rendered colours, so no theme observer is needed.
 */

/** `@atlaskit/icon/core/person`, at the 16px the avatar renders it. */
const PERSON_ICON_SVG = `<svg width="16" height="16" fill="none" viewBox="0 0 16 16" role="presentation" style="display:block"><path fill="currentcolor" fill-rule="evenodd" d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z" clip-rule="evenodd"/></svg>`;

/** `@atlaskit/icon-lab/core/ai-bot`, at 12px so it fits inside the 16px hexagon. */
const AI_BOT_ICON_SVG = `<svg width="12" height="12" fill="none" viewBox="0 0 16 16" role="presentation" style="display:block"><path fill="currentcolor" d="M13 5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5zm-6.5 2v3H5v-3zm4.5 0v3H9.5v-3zm3.5 1H16V10h-1.5v3a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-3H0V8.5h1.5v-3a2 2 0 0 1 2-2h3.75v-2H4V0h4a.75.75 0 0 1 .75.75V3.5h3.75a2 2 0 0 1 2 2z"/></svg>`;

/** `RovoHexIcon` from `@atlaskit/logo/rovo-hex/icon`, at the 16px `xxsmall` renders. */
const ROVO_HEX_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" role="presentation" style="display:block"><path fill="#1868db" fill-rule="evenodd" d="m13.227 16.789-7.154 4.169-3.403-1.96a2.72 2.72 0 0 1-1.362-2.355V7.366c0-.973.518-1.87 1.361-2.354l6.044-3.487-.038.114a3.6 3.6 0 0 0-.172 1.088v9.278c0 1.274.68 2.45 1.786 3.085z" clip-rule="evenodd"/><path fill="#6a9a23" fill-rule="evenodd" d="m11.296 15.671-7.193 4.153 6.607 3.812a2.73 2.73 0 0 0 2.676.026l.048-.033a2.73 2.73 0 0 0 1.232-1.525 2.7 2.7 0 0 0 .127-.822v-3.594z" clip-rule="evenodd"/><path fill="#af59e1" fill-rule="evenodd" d="m21.477 5.003-4.404-2.539-5.904 4.89 2.69 1.556a3.56 3.56 0 0 1 1.785 3.086v9.277a3.6 3.6 0 0 1-.21 1.202l6.044-3.486a2.71 2.71 0 0 0 1.362-2.355V7.357c0-.97-.521-1.87-1.363-2.354" clip-rule="evenodd"/><path fill="#fca700" fill-rule="evenodd" d="M12.74 8.266 9.353 6.312V2.718c0-.283.044-.56.127-.821A2.73 2.73 0 0 1 10.71.372V.37a.4.4 0 0 0 .048-.033 2.73 2.73 0 0 1 2.676.026l6.499 3.75z" clip-rule="evenodd"/></svg>`;

/** ClaudeLogo from ai-mate/studio-browse-kit, inset to fit the agent hexagon. */
const CLAUDE_ICON_SVG = `<svg width="12" height="12" viewBox="8 8 32 32" role="presentation" style="display:block"><path fill="#FFFFFF" d="M14.2785 29.274L20.5732 25.7445L20.6785 25.4369L20.5732 25.2669H20.2653L19.2122 25.2021L15.6152 25.105L12.4962 24.9755L9.47443 24.8136L8.71291 24.6517L8 23.7126L8.07291 23.2431L8.71291 22.8141L9.62835 22.895L11.6537 23.0326L14.6916 23.2431L16.8952 23.3726L20.16 23.7126H20.6785L20.7514 23.5022L20.5732 23.3726L20.4354 23.2431L17.2922 21.1141L13.8896 18.8636L12.1073 17.5684L11.1433 16.9127L10.6572 16.2975L10.4466 14.9537L11.3215 13.9904L12.4962 14.0713L12.7959 14.1523L13.9868 15.067L16.5306 17.0342L19.8522 19.4789L20.3382 19.8836L20.5327 19.746L20.557 19.6489L20.3382 19.2846L18.5316 16.0223L16.6035 12.7033L15.7448 11.3271L15.518 10.5014C15.437 10.1614 15.3803 9.87807 15.3803 9.52998L16.3767 8.17809L16.9276 8L18.2562 8.17809L18.8152 8.6638L19.6415 10.55L20.9782 13.5209L23.0522 17.5603L23.6597 18.7584L23.9838 19.8674L24.1053 20.2074H24.3159V20.0132L24.4861 17.7384L24.802 14.9456L25.1099 11.3514L25.2152 10.3395L25.7175 9.12522L26.7139 8.46952L27.4916 8.84189L28.1316 9.75664L28.0425 10.3476L27.6618 12.8166L26.9165 16.6861L26.4304 19.2765H26.7139L27.038 18.9527L28.3504 17.2122L30.5539 14.4599L31.5261 13.3671L32.6603 12.1609L33.3894 11.5861H34.7666L35.7792 13.0918L35.3256 14.6461L33.9079 16.4432L32.7332 17.9651L31.0481 20.2317L29.9949 22.045L30.0922 22.1907L30.3433 22.1665L34.1509 21.3569L36.2086 20.9846L38.6633 20.5636L39.7732 21.0817L39.8947 21.6079L39.4572 22.6845L36.8324 23.3322L33.7539 23.9474L29.1686 25.0321L29.1119 25.0726L29.1767 25.1536L31.2425 25.3478L32.1256 25.3964H34.2886L38.3149 25.6959L39.3681 26.3921L40 27.2421L39.8947 27.8897L38.2744 28.7154L36.0871 28.1973L30.9833 26.9831L29.2334 26.5459H28.9904V26.6916L30.4486 28.1164L33.122 30.5287L36.4678 33.6372L36.638 34.4063L36.2086 35.0134L35.7549 34.9486L32.8142 32.7387L31.68 31.743L29.1119 29.5816H28.9418V29.8082L29.5332 30.6744L32.6603 35.3696L32.8223 36.8105L32.5954 37.28L31.7853 37.5634L30.8942 37.4015L29.0633 34.8353L27.1757 31.9454L25.6527 29.3549L25.4663 29.4602L24.5671 39.1338L24.1458 39.6276L23.1737 40L22.3635 39.3848L21.9342 38.3891L22.3635 36.422L22.882 33.8558L23.3033 31.8158L23.6841 29.2821L23.9109 28.4402L23.8947 28.3835L23.7084 28.4078L21.7965 31.0306L18.8881 34.9567L16.5873 37.4177L16.0365 37.6362L15.0805 37.1424L15.1696 36.2601L15.7043 35.4748L18.8881 31.4273L20.8081 28.9178L22.0476 27.4688L22.0395 27.2583H21.9666L13.5089 32.7468L12.002 32.9411L11.3539 32.3339L11.4349 31.3382L11.7428 31.0144L14.2866 29.2659L14.2785 29.274Z"/></svg>`;

export type ContributorTagIcon = 'aiBot' | 'claude' | 'person' | 'rovoHex';

const markup: Record<ContributorTagIcon, string> = {
	aiBot: AI_BOT_ICON_SVG,
	claude: CLAUDE_ICON_SVG,
	person: PERSON_ICON_SVG,
	rovoHex: ROVO_HEX_ICON_SVG,
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
