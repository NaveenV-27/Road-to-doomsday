
import { useEffect, useRef, useState } from "react";

export default function SectionVideo({
  playlist = [],
  overlay = "strong",
}) {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);

  const currentSource = playlist[index];
  const isSingleClip = playlist.length === 1;

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !currentSource) return;

    video.play().catch(() => {
      // The browser may block autoplay.
    });
  }, [currentSource]);

  const handleEnded = () => {
    if (playlist.length > 1) {
      setIndex((previous) => (previous + 1) % playlist.length);
    }
  };

  if (!playlist.length) return null;

  const overlayClass =
    overlay === "soft"
      ? "bg-gradient-to-b from-black/35 via-black/40 to-bg/85"
      : "bg-gradient-to-b from-black/70 via-black/75 to-bg/95";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <video
        key={currentSource}
        ref={videoRef}
        src={currentSource}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        loop={isSingleClip}
        preload="auto"
        onEnded={handleEnded}
      />

      <div className={`absolute inset-0 ${overlayClass}`} />
    </div>
  );
}
