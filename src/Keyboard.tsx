import classNames from 'classnames';
import type { VoidFunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { Flag } from './useWordle';

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Ñ',
  'Enter',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'Backspace',
];

const layout = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Ñ',
  '↵',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '⇤',
];

interface Props {
  letterStatus: Record<string, Flag>;
}

export const Keyboard: VoidFunctionComponent<Props> = ({ letterStatus }) => {
  const [pressedKey, setPressedKey] = useState('');

  const onMouseDown = useCallback(
    (key: string) => () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key }));
    },
    [],
  );

  const onMouseUp = useCallback(
    (key: string) => () => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key }));
    },
    [],
  );

  const onKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    setPressedKey(event.key.length === 1 ? event.key.toUpperCase() : event.key);
  }, []);

  const onKeyUp = useCallback(() => {
    setPressedKey('');
  }, []);

  const onTouchStart = useCallback(
    (key: string) => () => {
      setPressedKey(key);
    },
    [],
  );

  const onTouchEnd = useCallback(() => {
    setPressedKey('');
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return (
    <div className="keyboard">
      {keys.map((key, ix) => (
        <button
          className={classNames([
            letterStatus[key] ?? '',
            key.length !== 1 ? 'special' : '',
            { pressed: pressedKey === key },
          ])}
          key={key}
          onMouseDown={onMouseDown(key)}
          onMouseUp={onMouseUp(key)}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart(key)}
        >
          {layout[ix]}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;
