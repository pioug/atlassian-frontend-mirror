const SupportedBrowsers = ['ie', 'gecko', 'chrome', 'safari'] as const;
export type Browsers = (typeof SupportedBrowsers)[number];
export type Range = { minimum: number; maximum?: number };
export type DisableSpellcheckByBrowser = { [b in Browsers]?: Range };
