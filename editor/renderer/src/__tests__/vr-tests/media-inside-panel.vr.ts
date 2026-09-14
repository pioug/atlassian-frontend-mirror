import { snapshot } from '@af/visual-regression';
import { MediaInsidePanelFullPage } from '../__helpers/rendererComponents.vr.ap';

// ED-22242 Media should respect panel size
snapshot(MediaInsidePanelFullPage);
