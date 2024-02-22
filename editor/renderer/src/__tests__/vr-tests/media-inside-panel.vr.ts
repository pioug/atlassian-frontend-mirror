import { snapshot } from '@af/visual-regression';
import { MediaInsidePanelFullPage } from '../__helpers/rendererComponents';

// ED-22242 Media should respect panel size
snapshot(MediaInsidePanelFullPage);
