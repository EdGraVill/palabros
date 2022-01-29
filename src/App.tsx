import { useCallback, useState } from 'react';
import Keyboard from './Keyboard';
import Row from './Row';
import type { Flag } from './useWordle';
import useWordle from './useWordle';

function App() {
  const [nthTryMax, setNthTryMax] = useState(5);
  const [isLoading, checkWord, nthTry] = useWordle(5, nthTryMax);
  const [isWinner, setWinnerState] = useState(false);
  const [letterStatus, setLetterStatus] = useState<Record<string, Flag>>({});

  const onCheckWord = useCallback(
    (word: string) => {
      const result = checkWord(word);

      setLetterStatus((currentStatus) => ({
        ...word.split('').reduce((acc, letter, ix) => {
          if (
            !currentStatus[letter] ||
            currentStatus[letter] === 'gray' ||
            (currentStatus[letter] === 'yellow' && result.result[ix] === 'green')
          ) {
            return { ...acc, [letter]: result.result[ix] };
          }

          return acc;
        }, currentStatus),
      }));

      setWinnerState(result.isWinner);

      return result;
    },
    [checkWord],
  );

  return (
    <div className="App">
      <div>
        {Array.from({ length: nthTryMax }).map((_, ix) => (
          <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== ix} key={ix} />
        ))}
      </div>
      <Keyboard letterStatus={letterStatus} />
    </div>
  );
}

export default App;
