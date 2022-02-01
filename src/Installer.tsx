import classNames from 'classnames';
import type { VoidFunctionComponent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const Installer: VoidFunctionComponent = () => {
  const [isVisible, setVisibleState] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent>();

  useEffect(() => {
    const eventHandler = (e: Event) => {
      e.preventDefault();

      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setVisibleState(true);
    };

    window.addEventListener('beforeinstallprompt', eventHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', eventHandler);
    };
  }, []);

  const onInstall = useCallback(async () => {
    console.log('Installed');

    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
    }

    setVisibleState(false);
  }, []);

  return (
    <div className={classNames(['modal', { isVisible }])}>
      <div>
        <h2>¡Juega sin internet!</h2>
        <p>¿Te gustaría instalar este juego en tu dispositivo para poder jugar sin internet?</p>
        <div className="buttons">
          <button onClick={onInstall}>Instalar</button>
          <button onClick={() => setVisibleState(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Installer;
