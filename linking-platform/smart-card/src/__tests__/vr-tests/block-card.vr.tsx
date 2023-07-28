import { snapshot } from '@af/visual-regression';

import BlockCardError from '../../../examples/vr-block-card/vr-block-card-error';
import BlockCardForbidden from '../../../examples/vr-block-card/vr-block-card-forbidden';
import BlockCardNotFound from '../../../examples/vr-block-card/vr-block-card-not-found';
import BlockCardUnauthorised from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import BlockCardUnauthorisedNoAuth from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';

snapshot(BlockCardError);
snapshot(BlockCardForbidden);
snapshot(BlockCardNotFound);
snapshot(BlockCardUnauthorised);
snapshot(BlockCardUnauthorisedNoAuth);
