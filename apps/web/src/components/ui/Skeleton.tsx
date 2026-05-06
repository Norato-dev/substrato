'use client';

export function Skeleton({ width, height, radius = '4px', style }: { width?: string | number; height?: string | number; radius?: string; style?: React.CSSProperties }) {
  return (
    <>
      <div
        style={{
          width: width ?? '100%',
          height: height ?? '16px',
          borderRadius: radius,
          background: 'linear-gradient(90deg, rgba(13,13,13,0.04) 0%, rgba(13,13,13,0.08) 50%, rgba(13,13,13,0.04) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.8s ease-in-out infinite',
          ...style,
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

export function SkeletonBlob({ size = 36 }: { size?: number }) {
  return (
    <div
      className="organic-blob"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(90deg, rgba(13,13,13,0.04) 0%, rgba(13,13,13,0.08) 50%, rgba(13,13,13,0.04) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
        flexShrink: 0,
      }}
    />
  );
}