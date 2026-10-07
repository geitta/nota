import { useEffect, useRef, useState } from "react";

// Minimal shape of the YT global the IFrame Player API attaches to window —
// only the parts this hook actually uses, not the full API surface.
interface YTPlayer {
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      events: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<YTNamespace> | null = null;

/**
 * Loads YouTube's IFrame Player API script exactly once per page, even if
 * multiple components call this hook — the API calls a single global
 * `onYouTubeIframeAPIReady` callback when ready, so concurrent loads need
 * to share one promise rather than each trying to inject the script.
 */
function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (window.YT) return Promise.resolve(window.YT);
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YTNamespace);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

/**
 * Mounts a real YouTube player into the given ref's element and polls its
 * actual playback position — this replaces a plain <iframe src="..."> or
 * a fake setInterval clock with the real IFrame Player API, which is what
 * the sync engine needs an honest currentTimeSec from.
 */
export function useYouTubePlayer(videoId: string | undefined) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    let cancelled = false;

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => {
            const playing = event.data === YT.PlayerState.PLAYING;
            if (playing && !pollRef.current) {
              // 1s resolution matches the SyncPoint granularity the seed
              // data was written at — no value in polling faster than the
              // data itself can distinguish.
              pollRef.current = setInterval(() => {
                if (playerRef.current) {
                  setCurrentTimeSec(playerRef.current.getCurrentTime());
                }
              }, 1000);
            } else if (!playing && pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
  }, [videoId]);

  return { containerRef, currentTimeSec, isReady };
}
