import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F0EDE6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '70%',
            height: '70%',
            background: '#5DCAA5',
            borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
          }}
        />
      </div>
    ),
    { ...size }
  );
}