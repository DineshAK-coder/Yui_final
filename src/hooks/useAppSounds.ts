import { useCallback } from 'react';
import useSound from 'use-sound';

// We rely on free UI sounds. Placeholders for public/sounds/ path.
// If the actual files don't exist, use-sound will just silently fail to play, 
// ensuring the app doesn't break, while being set up perfectly for real assets.
const HOVER_SOUND = '/sounds/hover.mp3';
const CLICK_SOUND = '/sounds/click.mp3';
const SUCCESS_SOUND = '/sounds/success.mp3';
const ALERT_SOUND = '/sounds/alert.mp3';
const POP_SOUND = '/sounds/pop.mp3';

export function useAppSounds() {
  const [playHoverOriginal] = useSound(HOVER_SOUND, { volume: 0.25 });
  const [playClickOriginal] = useSound(CLICK_SOUND, { volume: 0.5 });
  const [playSuccessOriginal] = useSound(SUCCESS_SOUND, { volume: 0.5 });
  const [playAlertOriginal] = useSound(ALERT_SOUND, { volume: 0.4 });
  const [playPopOriginal] = useSound(POP_SOUND, { volume: 0.4 });

  // Safe wrappers in case we want to add global mute logic later
  const playHover = useCallback(() => {
    try { playHoverOriginal(); } catch (e) {}
  }, [playHoverOriginal]);

  const playClick = useCallback(() => {
    try { playClickOriginal(); } catch (e) {}
  }, [playClickOriginal]);

  const playSuccess = useCallback(() => {
    try { playSuccessOriginal(); } catch (e) {}
  }, [playSuccessOriginal]);

  const playAlert = useCallback(() => {
    try { playAlertOriginal(); } catch (e) {}
  }, [playAlertOriginal]);

  const playPop = useCallback(() => {
    try { playPopOriginal(); } catch (e) {}
  }, [playPopOriginal]);

  return {
    playHover,
    playClick,
    playSuccess,
    playAlert,
    playPop,
  };
}
