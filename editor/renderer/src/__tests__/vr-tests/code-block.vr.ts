import { snapshot } from '@af/visual-regression';
import {
	CodeBlockRendererCopy,
	CodeBlockRendererCopyWrap,
	CodeBlockRendererTrailingNewline,
	CodeBlockRendererWrap,
	CodeBlockRendererOverflow,
} from './code-block.fixture';

snapshot(CodeBlockRendererCopy, {
	description: 'should render copy button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererCopyWrap, {
	description: 'should render both copy and wrap button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererTrailingNewline, {
	description: 'should render trailing newline',
});

snapshot(CodeBlockRendererWrap, {
	description: 'should render wrap button on hover if enabled',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererOverflow, {
	description: 'should render overflow as expected',
});
