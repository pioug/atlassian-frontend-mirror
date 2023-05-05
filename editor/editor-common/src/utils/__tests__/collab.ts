import { uuid } from '@atlaskit/adf-schema';
import { Participants } from '@atlaskit/editor-core/src/plugins/collab-edit/participants';
import { CollabParticipant } from '@atlaskit/editor-core/src/plugins/collab-edit/types';

import { getParticipantsCount } from '../collab';

function makeParticipant(): CollabParticipant {
  const participant: CollabParticipant = {
    lastActive: 0,
    sessionId: uuid.generate(),
    avatar: uuid.generate(),
    name: 'Fred',
  };
  return participant;
}

describe('getParticipantsCount', () => {
  describe('sessions', () => {
    it('should return 1 when no collab plugin', () => {
      expect(getParticipantsCount()).toBe(1);
    });

    it('should return number of participants when collab', () => {
      const participants = new Participants();

      const participantArray: CollabParticipant[] = [];

      for (let i = 0; i < 3; i++) {
        participantArray.push(makeParticipant());
      }

      const participantsSet = participants.add(participantArray);

      const editorState = {
        collabEditPlugin$: {
          participants: participantsSet,
        },
      };
      expect(getParticipantsCount(editorState as any)).toBe(3);
    });
  });
});
