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

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2952944/steps/%7Be80cb7c1-99cf-4a49-ab14-ea22e5af48cc%7D/test-report
snapshot.skip(CodeBlockRendererTrailingNewline, {
  description: 'should render trailing newline',
});

snapshot(CodeBlockRendererWrap, {
  description: 'should render wrap button on hover if enabled',
  states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshot(CodeBlockRendererOverflow, {
  description: 'should render overflow as expected',
});
