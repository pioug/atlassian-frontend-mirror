import { doc, link, paragraph, text } from '@atlaskit/adf-utils';

import { ExtensionLinkComponentProps } from './types';

export const ExtensionLinkComponent = (props: ExtensionLinkComponentProps) => {
  const url = props.extension.parameters.macroParams.url.value;
  const render = props.render;
  const document = doc(
    paragraph(
      link({
        href: url,
        title: url,
      })(text(url)),
    ),
  );

  return render(document);
};
