import type { EditorAppearance } from '../../types';
import { LongPressSelectionPluginOptions } from '../selection/types';

export interface CodeBlockOptions extends LongPressSelectionPluginOptions {
  allowCopyToClipboard?: boolean;
  allowCompositionInputOverride?: boolean;
  // We are not using EditorProps['appearance'] here as CodeBlockOptions is used
  // inside the type EditorProps, and so doing so triggers a recursion issue in
  // extract-react-types
  appearance?: EditorAppearance | undefined;
}
