import type { ChangeEvent, MouseEvent, VoidFunctionComponent } from 'react';
import { useCallback } from 'react';
import type { WordLength } from './useWordle';
import { words } from './useWordle';
import { getRandomInt } from './util';

interface Props {
  newGame(): void;
  nthTryMax: number;
  setNthTryMax(newNthTryMax: number): void;
  setWordLength(newWordLength: WordLength): void;
  wordLength: WordLength;
}

const colors = ['', 'green', 'yellow', 'gray'];

const Header: VoidFunctionComponent<Props> = ({ newGame, nthTryMax, setNthTryMax, setWordLength, wordLength }) => {
  const onNewGame = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      newGame();
      event.currentTarget.blur();
    },
    [newGame],
  );

  const onWordLengthChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setWordLength(Number(event.currentTarget.value) as WordLength);
    },
    [setWordLength],
  );

  const onNthTryMaxChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setNthTryMax(Number(event.currentTarget.value));
    },
    [setNthTryMax],
  );

  return (
    <header>
      <div className="newGame">
        <button onClick={onNewGame}>Nuevo Juego</button>
      </div>
      <h1>
        {'PALABROS'.split('').map((letter, ix) => (
          <span className={colors[getRandomInt(0, 4)]} key={ix}>
            {letter}
          </span>
        ))}
      </h1>
      <div className="controls">
        <label>
          <span>Letras:</span>
          <select onChange={onWordLengthChange} value={wordLength}>
            {Object.keys(words).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Intentos:</span>
          <select onChange={onNthTryMaxChange} value={nthTryMax}>
            {Object.keys(words).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};

export default Header;
