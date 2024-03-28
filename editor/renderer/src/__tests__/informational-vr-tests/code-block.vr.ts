import { snapshotInformational } from '@af/visual-regression';
import { CodeBlockRendererLayout } from './code-block.fixture';

snapshotInformational(CodeBlockRendererLayout, {
  selector: { byTestId: 'renderer-code-block' },
  description: 'should render buttons currently inside a layout',
  states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});
