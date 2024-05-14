import React from 'react';

type ImgIconProps = {
  src: string;
  alt: string;
};

const ImgIcon = ({ src, alt }: ImgIconProps) => {
  return (
    <img
      alt={alt}
      src={src}
      height={24}
      width={24}
      style={{ borderRadius: 3 }}
    />
  );
};

export default ImgIcon;
