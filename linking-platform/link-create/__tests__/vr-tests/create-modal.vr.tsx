import { snapshot } from '@af/visual-regression';

import {
  DefaultCreateWithEditButton,
  DefaultCreateWithModal,
  DefaultCreateWithModalTitle,
} from '../../examples/vr/vr-create-modal';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
  drawsOutsideBounds: true,
  variants: [
    {
      name: 'default',
      environment: {},
    },
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
};

snapshot(DefaultCreateWithModal, options);
snapshot(DefaultCreateWithModalTitle, options);
snapshot(DefaultCreateWithEditButton, options);
