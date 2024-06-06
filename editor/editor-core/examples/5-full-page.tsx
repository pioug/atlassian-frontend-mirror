/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { FullPageBase } from "@af/editor-examples-helpers/example-presets";
import type { ExampleProps } from "@af/editor-examples-helpers/example-presets";

export { ExampleEditor, ExampleEditorComponent, getAppearance, quickInsertProvider, mediaProvider, getProviders, SaveAndCancelButtons, saveChanges, LOCALSTORAGE_defaultTitleKey, LOCALSTORAGE_defaultDocKey, BROWSER_FREEZE_NORMAL_SEVERITY_THRESHOLD, PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD, PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD } from "@af/editor-examples-helpers/example-presets"

const FullPageExample = (props: ExampleProps) => {
  return <FullPageBase {...props} />;
}

export default FullPageExample;
