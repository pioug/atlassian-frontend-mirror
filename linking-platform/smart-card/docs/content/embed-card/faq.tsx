import customMd from '../../utils/custom-md';

export default customMd`

#### Does Smart Link embed support theming?

Smart Links decorates the embed URL (iframe) by appending the query parameter \`themeState\` with a value obtained from \`@atlaskit/tokens\` using \`useThemeObserver()\`.

The list of 1P Smart Links with embed content that support theming can be found [here](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/linking-platform/smart-card/src/extractors/constants.ts#17).

#### How does Smart Link display confluence embed?

The embed URL for Confluence embed is pointing to [lp-cc-embed](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/services/lp-cc-embed) service which hosts component from \`@atlassian/embedded-confluence\`.
See the configurations [here](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/services/lp-cc-embed/src/app.tsx).
`;
