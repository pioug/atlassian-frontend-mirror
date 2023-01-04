import { AvatarPickerDialog, Avatar } from '@atlaskit/media-avatar-picker';
import React from 'react';
import { useState } from 'react';
import { generateAvatars } from '../../example-helpers';
import Button from '@atlaskit/button/custom-theme-button';

const avatars: Array<Avatar> = generateAvatars(30);

interface AvatarAppProps {
  isOpen: boolean;
}

const AvatarApp = ({ isOpen }: AvatarAppProps) => {
  const [canDialogOpen, setDialogOpen] = useState(isOpen);
  const [imageSrc, setImageSrc] = useState('');
  return (
    <div>
      <div>
        <Button appearance="primary" onClick={() => setDialogOpen(true)}>
          Open sesame!
        </Button>
        <img
          width={400}
          height={360}
          src={imageSrc}
          style={{
            visibility: imageSrc.length > 0 ? 'visible' : 'hidden',
            marginLeft: '20%',
          }}
        />
      </div>
      {canDialogOpen && (
        <AvatarPickerDialog
          avatars={avatars}
          onImagePicked={(selectedImage, crop) => {
            selectedImage.arrayBuffer().then((buffer) => {
              const image = Buffer.from(buffer);
              const img = image.toString('base64');
              setImageSrc(`data:image/json;base64,${img}`);
              setDialogOpen(false);
            });
          }}
          onAvatarPicked={(selectedAvatar) => {
            setImageSrc(selectedAvatar.dataURI);
            setDialogOpen(false);
          }}
          onCancel={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default AvatarApp;
