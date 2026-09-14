import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EditorWithProvidersExample from './editor-with-providers.example';
import ProjectIconVrExample from './ProjectIcon.example.vr.ap';
import RendererWithProvidersExample from './renderer-with-providers.example';

export const EditorWithProviders: WorkbenchExample = wb(EditorWithProvidersExample);
export const ProjectIconVr: WorkbenchExample = wb(ProjectIconVrExample);
export const RendererWithProviders: WorkbenchExample = wb(RendererWithProvidersExample);
