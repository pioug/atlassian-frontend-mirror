import { snapshot } from '@af/visual-regression';

import EmbedCardError from '../../../examples/vr-embed-card/vr-embed-card-error';
import EmbedCardForbidden from '../../../examples/vr-embed-card/vr-embed-card-forbidden';
import EmbedCardNotFound from '../../../examples/vr-embed-card/vr-embed-card-not-found';
import EmbedCardUnauthorised from '../../../examples/vr-embed-card/vr-embed-card-unauthorised';
import EmbedCardUnauthorisedWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image';
import EmbedCardUnauthorisedNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth';

snapshot(EmbedCardError);
snapshot(EmbedCardForbidden);
snapshot(EmbedCardNotFound);
snapshot(EmbedCardUnauthorised);
snapshot(EmbedCardUnauthorisedWithProviderImage);
snapshot(EmbedCardUnauthorisedNoAuth);
