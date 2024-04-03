import { expandADF } from '../__fixtures__/expand-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const ExpandRenderer = generateRendererComponent({
  document: expandADF(),
  appearance: 'full-width',
});

export const ExpandHoveredRenderer = generateRendererComponent({
  document: expandADF(),
  appearance: 'full-width',
});

export const ExpandWrappedRenderer = generateRendererComponent({
  document: expandADF(
    undefined,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem',
  ),
  appearance: 'full-width',
});

export const ExpandDefaultModeRenderer = generateRendererComponent({
  document: expandADF('default'),
  appearance: 'full-width',
});

export const ExpandWideModeRenderer = generateRendererComponent({
  document: expandADF('wide'),
  appearance: 'full-width',
});

export const ExpandFullWidthModeRenderer = generateRendererComponent({
  document: expandADF('full-width'),
  appearance: 'full-width',
});
