import { snapshot } from '@af/visual-regression';

import RelatedLinksModal from '../../../examples/vr-related-links-modal/vr-related-links-modal';
import RelatedLinksResolvedView from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view';
import RelatedLinksResolvedViewWithEmptyList from '../../../examples/vr-related-links-modal/vr-related-links-modal-resolved-view-empty-outgoing';
import VrRelatedLinksModalErroredView
  from "../../../examples/vr-related-links-modal/vr-related-links-modal-errored-view";
import VrRelatedLinksModalUnavailableView
  from "../../../examples/vr-related-links-modal/vr-related-links-modal-unavailable-view";

snapshot(RelatedLinksModal, {
  variants: [
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
});

snapshot(RelatedLinksResolvedView, {
  variants: [
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
});

snapshot(RelatedLinksResolvedViewWithEmptyList, {
  variants: [
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
});

snapshot(VrRelatedLinksModalErroredView, {
  variants: [
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
});

snapshot(VrRelatedLinksModalUnavailableView, {
  variants: [
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
});
