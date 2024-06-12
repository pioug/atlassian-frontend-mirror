import { snapshot } from '@af/visual-regression';

import DefaultModal from '../../../examples/00-default-modal';
import Appearance from '../../../examples/10-appearance';
import Autofocus from '../../../examples/20-autofocus';
import Form from '../../../examples/45-form';
import FormAsContainer from '../../../examples/46-form-as-container';
import Width from '../../../examples/50-width';
import Scroll from '../../../examples/55-scroll';
import MultiLineTitles from '../../../examples/65-multi-line-titles';

snapshot(DefaultModal, {
	drawsOutsideBounds: true,
});
snapshot(Scroll, {
	drawsOutsideBounds: true,
});
snapshot(Form, {
	drawsOutsideBounds: true,
});
snapshot(FormAsContainer);
snapshot(Autofocus, {
	drawsOutsideBounds: true,
});
snapshot(Appearance, {
	drawsOutsideBounds: true,
});
snapshot(Width, {
	drawsOutsideBounds: true,
});
snapshot(MultiLineTitles, {
	drawsOutsideBounds: true,
});
