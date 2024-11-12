import customMd from '../../utils/custom-md';
import embedInEditorFaq from '../embed-in-editor-faq';

export default customMd`

#### Does Smart Link embed support theming?

Smart Links decorates the embed URL (iframe) by appending the query parameter \`themeState\` with a value obtained from \`@atlaskit/tokens\` using \`useThemeObserver()\`.

The list of 1P Smart Links with embed content that support theming can be found [here](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/linking-platform/smart-card/src/extractors/constants.ts#17).

#### How does Smart Link display confluence embed?

The embed URL for Confluence embed is pointing to \`lp-cc-embed\` service which hosts component from \`@atlassian/embedded-confluence\`.

&nbsp;

${embedInEditorFaq}
`;
