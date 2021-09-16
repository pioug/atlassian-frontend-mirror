import React from 'react';
import { render, cleanup } from '@testing-library/react';

import path from 'path';
import fs from 'fs';
import { size } from '../../..';
import BookIcon from '../../../../glyph/book';
import { size as defaultSize } from '../../..';
import metadata from '../../../metadata';

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = (dir: string, filelist: string[]) => {
  let fl = filelist;
  const files = fs.readdirSync(dir);
  fl = filelist || [];
  files.forEach((file) => {
    const pth = path.join(dir, file);
    if (fs.statSync(pth).isDirectory()) {
      fl = walkSync(pth, fl);
    } else {
      fl.push(pth);
    }
  });
  return filelist;
};

describe('@atlaskit/icon', () => {
  afterEach(cleanup);
  describe('exports', () => {
    it('are properly defined for atomic ones', () => {
      // NOTE Please remember:
      // An addition is a feature
      // a removal or rename is a BREAKING CHANGE

      // NOTE the reduced-ui-pack package uses the icons from this package, so if you change
      // anything in the list below then you'll also need to update the tests in reduced-ui-pack.
      // A breaking change to this package is also a breaking change to the reduced-ui-pack package.

      // This list should be sorted alphabetically.
      const expected = [
        'activity',
        'add-circle',
        'add-item',
        'add',
        'addon',
        'app-access',
        'arrow-down-circle',
        'arrow-down',
        'arrow-left-circle',
        'arrow-left',
        'arrow-right-circle',
        'arrow-right',
        'arrow-up-circle',
        'arrow-up',
        'attachment',
        'audio-circle',
        'audio',
        'backlog',
        'billing-filled',
        'billing',
        'bitbucket/branches',
        'bitbucket/builds',
        'bitbucket/clone',
        'bitbucket/commits',
        'bitbucket/compare',
        'bitbucket/forks',
        'bitbucket/output',
        'bitbucket/pipelines',
        'bitbucket/pullrequests',
        'bitbucket/repos',
        'bitbucket/snippets',
        'bitbucket/source',
        'board',
        'book',
        'bullet-list',
        'calendar-filled',
        'calendar',
        'camera-filled',
        'camera-rotate',
        'camera-take-picture',
        'camera',
        'canvas',
        'check-circle',
        'check',
        'checkbox',
        'checkbox-indeterminate',
        'chevron-down-circle',
        'chevron-down',
        'chevron-left-circle',
        'chevron-left',
        'chevron-right-circle',
        'chevron-right',
        'chevron-up-circle',
        'chevron-up',
        'code',
        'comment',
        'component',
        'copy',
        'creditcard-filled',
        'creditcard',
        'cross-circle',
        'cross',
        'dashboard',
        'decision',
        'detail-view',
        'discover-filled',
        'discover',
        'document-filled',
        'document',
        'documents',
        'download',
        'drag-handler',
        'dropbox',
        'edit-filled',
        'edit',
        'editor/add',
        'editor/addon',
        'editor/advanced',
        'editor/align-center',
        'editor/align-left',
        'editor/align-right',
        'editor/align-image-center',
        'editor/align-image-left',
        'editor/align-image-right',
        'editor/attachment',
        'editor/bold',
        'editor/bullet-list',
        'editor/close',
        'editor/code',
        'editor/date',
        'editor/decision',
        'editor/done',
        'editor/edit',
        'editor/emoji',
        'editor/error',
        'editor/feedback',
        'editor/file',
        'editor/file-preview',
        'editor/help',
        'editor/hint',
        'editor/image-border',
        'editor/image-resize',
        'editor/image',
        'editor/indent',
        'editor/info',
        'editor/italic',
        'editor/link',
        'editor/mention',
        'editor/more',
        'editor/note',
        'editor/number-list',
        'editor/open',
        'editor/outdent',
        'editor/panel',
        'editor/photo',
        'editor/quote',
        'editor/recent',
        'editor/redo',
        'editor/remove',
        'editor/search',
        'editor/strikethrough',
        'editor/table',
        'editor/task',
        'editor/text-color',
        'editor/text-style',
        'editor/underline',
        'editor/undo',
        'editor/unlink',
        'editor/warning',
        'email',
        'emoji',
        'emoji/activity',
        'emoji/atlassian',
        'emoji/custom',
        'emoji/emoji',
        'emoji/flags',
        'emoji/food',
        'emoji/frequent',
        'emoji/keyboard',
        'emoji/nature',
        'emoji/objects',
        'emoji/people',
        'emoji/symbols',
        'emoji/travel',
        'error',
        'export',
        'feedback',
        'file',
        'filter',
        'flag-filled',
        'folder-filled',
        'folder',
        'followers',
        'following',
        'googledrive',
        'graph-bar',
        'graph-line',
        'gsuite',
        'highlights',
        'hipchat/audio-only',
        'hipchat/chevron-double-down',
        'hipchat/chevron-double-up',
        'hipchat/chevron-down',
        'hipchat/chevron-up',
        'hipchat/dial-out',
        'hipchat/lobby',
        'hipchat/media-attachment-count',
        'hipchat/outgoing-sound',
        'hipchat/sd-video',
        'home',
        'home-circle',
        'image-border',
        'image-resize',
        'image',
        'info',
        'invite-team',
        'issue-raise',
        'issue',
        'issues',
        'jira/capture',
        'jira/failed-build-status',
        'jira/labs',
        'jira/test-session',
        'lightbulb-filled',
        'lightbulb',
        'link-filled',
        'link',
        'list',
        'location',
        'lock-circle',
        'lock-filled',
        'lock',
        'marketplace',
        'media-services/actual-size',
        'media-services/add-comment',
        'media-services/annotate',
        'media-services/arrow',
        'media-services/audio',
        'media-services/blur',
        'media-services/brush',
        'media-services/button-option',
        'media-services/code',
        'media-services/document',
        'media-services/filter',
        'media-services/grid',
        'media-services/image',
        'media-services/line-thickness',
        'media-services/line',
        'media-services/open-mediaviewer',
        'media-services/oval',
        'media-services/pdf',
        'media-services/preselected',
        'media-services/presentation',
        'media-services/rectangle',
        'media-services/scale-large',
        'media-services/scale-small',
        'media-services/spreadsheet',
        'media-services/text',
        'media-services/unknown',
        'media-services/video',
        'media-services/zip',
        'media-services/zoom-in',
        'media-services/zoom-out',
        'mention',
        'menu',
        'menu-expand',
        'mobile',
        'more-vertical',
        'more',
        'notification-all',
        'notification-direct',
        'notification',
        'office-building-filled',
        'office-building',
        'open',
        'overview',
        'page-filled',
        'page',
        'pdf',
        'people-group',
        'people',
        'person-circle',
        'person-with-circle',
        'person-with-cross',
        'person-with-tick',
        'person',
        'portfolio',
        'preferences',
        'premium',
        'presence-active',
        'presence-busy',
        'presence-unavailable',
        'question-circle',
        'question',
        'queues',
        'quote',
        'radio',
        'recent',
        'redo',
        'refresh',
        'retry',
        'room-menu',
        'schedule-filled',
        'schedule',
        'screen',
        'search',
        'send',
        'settings',
        'share',
        'ship',
        'shortcut',
        'sign-in',
        'sign-out',
        'sprint',
        'star-filled',
        'star',
        'status',
        'stopwatch',
        'subtask',
        'switcher',
        'table',
        'task',
        'trash',
        'tray',
        'undo',
        'unlink',
        'unlock-circle',
        'unlock-filled',
        'unlock',
        'upload',
        'user-avatar-circle',
        'vid-audio-muted',
        'vid-audio-on',
        'vid-backward',
        'vid-camera-off',
        'vid-camera-on',
        'vid-connection-circle',
        'vid-forward',
        'vid-full-screen-off',
        'vid-full-screen-on',
        'vid-hang-up',
        'vid-hd-circle',
        'vid-pause',
        'vid-play',
        'vid-raised-hand',
        'vid-share-screen',
        'vid-speaking-circle',
        'vid-volume-full',
        'vid-volume-half',
        'vid-volume-muted',
        'video-circle',
        'video-filled',
        'warning',
        'watch-filled',
        'watch',
        'world-small',
        'star-large',
        'world',
        'suitcase',
        'select-clear',
        'roadmap',
        'questions',
        'app-switcher',
        'media-services/no-image',
        'label',
        'media-services/fit-to-page',
        'media-services/full-screen',
        'emoji/productivity',
        'emoji-add',
        'editor/success',
        'editor/table-display-options',
        'editor/media-center',
        'editor/media-full-width',
        'editor/media-wide',
        'editor/media-wrap-left',
        'editor/media-wrap-right',
        'editor/layout-single',
        'editor/layout-three-equal',
        'editor/layout-three-with-sidebars',
        'editor/layout-two-equal',
        'editor/layout-two-left-sidebar',
        'editor/layout-two-right-sidebar',
        'editor/background-color',
        'editor/divider',
        'editor/horizontal-rule',
        'editor/collapse',
        'editor/expand',
        'editor/settings',
        'department',
        'child-issues',
        'chevron-right-large',
        'chevron-left-large',
        'check-circle-outline',
        'like',
        'archive',
      ];

      const expectedPaths = expected.map((a) =>
        path.join(__dirname, '../../../../glyph', `${a}.js`),
      );

      const actual = walkSync(
        path.join(__dirname, '../../../../glyph'),
        [],
      ).filter((ab) => /.*\.js$/.test(ab));

      // Additional notes on this check:
      // We are doing an equality check on the sorted versions of the lists as we want to
      // ensure that every icon we expect exists, and also that only icons that we expect
      // exist. This ensures that a new icon cannot be removed without causing this test
      // to error.
      // If an icon is Recieved but not expected, it is a new icon we do not expect.
      // If it is Expected but not received, it means it is an existing icon that has been removed
      expect(actual.sort()).toEqual(expectedPaths.sort());
      // If you find yourself here and wonder why this list is not auto-generated, then bear in
      // mind that tests are supposed to tell you when a piece of software breaks.
      // As the sole purpose of this component is providing icons:
      //
      // * changing an icon is a patch
      // * adding an icon is a feature
      // * removing an icon is a breaking change
      // * renaming an icon is a breaking change
      //
      // If we were to auto-generate this list, then renaming, adding or removing would NOT
      // break any tests and thus not hint the developer at what kind of change they are making
    });

    describe('bundle', () => {
      it('has size export', () => {
        expect(defaultSize).toEqual(size);
      });
    });
  });

  describe('component structure', () => {
    Object.keys(metadata).forEach((key) => {
      it(`should be possible to create the ${key} component`, async () => {
        const component = await import(`../../../../glyph/${key}`);

        const Icon = component.default;
        const { getByLabelText } = render(<Icon label={Icon.name} />);
        expect(getByLabelText(Icon.name)).toBeDefined();
        expect(Icon).toBeInstanceOf(Function);
      });
    });
  });

  describe('props', () => {
    describe('label property', () => {
      it('should accept a label', () => {
        const label = 'my label';
        const { getByLabelText } = render(<BookIcon label={label} />);
        const span = getByLabelText(label);

        expect(span).toBeDefined();
      });
    });
  });
});
