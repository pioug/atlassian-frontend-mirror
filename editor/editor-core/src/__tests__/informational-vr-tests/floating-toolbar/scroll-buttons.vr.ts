import { snapshotInformational } from '@af/visual-regression';
import {
  prepareSetupForEmojiSelectorPopup,
  prepareSetupForColorSelectorPopup,
  dataTestDivSelector,
} from './scroll-buttons.util';
import {
  EditorFloatingToolbarWithFullWidthApperance,
  EditorFloatingToolbarWithChromelessApperance,
  EditorFloatingToolbarWithCommentApperance,
} from './scroll-buttons.fixtures';

snapshotInformational(EditorFloatingToolbarWithFullWidthApperance, {
  description:
    'should render emoji picker dropdown is opened with full-width appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForEmojiSelectorPopup,
});

snapshotInformational(EditorFloatingToolbarWithCommentApperance, {
  description:
    'should render emoji picker dropdown is opened with comment appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForEmojiSelectorPopup,
});

snapshotInformational(EditorFloatingToolbarWithChromelessApperance, {
  description:
    'should render emoji picker dropdown is opened with chromeless appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForEmojiSelectorPopup,
});

snapshotInformational(EditorFloatingToolbarWithFullWidthApperance, {
  description:
    'should render color picker dropdown is opened with full-width appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForColorSelectorPopup,
});

snapshotInformational(EditorFloatingToolbarWithCommentApperance, {
  description:
    'should render color picker dropdown is opened with comment appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForColorSelectorPopup,
});

snapshotInformational(EditorFloatingToolbarWithChromelessApperance, {
  description:
    'should render color picker dropdown is opened with chromeless appearance',
  selector: {
    byTestId: dataTestDivSelector,
  },
  prepare: prepareSetupForColorSelectorPopup,
});
