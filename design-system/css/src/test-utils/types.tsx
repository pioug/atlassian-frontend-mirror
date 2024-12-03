export type HTMLElementExtended<T extends HTMLElement = HTMLElement> = T & {
	textContentOriginal: string;
	textContentWithoutCss: string;
};

export type HTMLStyleElementExtended = HTMLElementExtended<HTMLStyleElement>;
