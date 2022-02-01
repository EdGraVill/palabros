import { useCallback, useState } from 'react';
import Header from './Header';
import Keyboard from './Keyboard';
import Row from './Row';
import type { WordLength } from './useWordle';
import useWordle from './useWordle';

function App() {
  const [wordLength, setWordLength] = useState<WordLength>(5);
  const [nthTryMax, setNthTryMax] = useState(5);
  const [isLoading, checkWord, nthTry, newGame] = useWordle(wordLength, nthTryMax);
  const [isWinner, setWinnerState] = useState(false);
  const [letterStatus, setLetterStatus] = useState<Record<string, string>>({});
  const [seed, setSeed] = useState<number[]>(Array.from({ length: nthTryMax }).map(Math.random));

  const onNewGame = useCallback(() => {
    setWinnerState(false);
    setLetterStatus({});
    setSeed(Array.from({ length: nthTryMax }).map(Math.random));
    newGame();
  }, [newGame]);

  const onCheckWord = useCallback(
    (word: string) => {
      const result = checkWord(word);

      setLetterStatus((currentStatus) => {
        const newStatus = word.split('').reduce((acc, letter, ix) => {
          if (
            !currentStatus[letter] ||
            currentStatus[letter] === 'gray' ||
            (currentStatus[letter] === 'yellow' && result.result[ix] === 'green')
          ) {
            return { ...acc, [letter]: result.result[ix] };
          }

          return acc;
        }, currentStatus);

        return {
          ...(result.rightWord || '').split('').reduce(
            (acc, letter) => ({
              ...acc,
              [letter]: acc[letter] ? `${acc[letter]} inWinner` : 'inWinner',
            }),
            newStatus,
          ),
        };
      });

      setWinnerState(result.isWinner);

      return result;
    },
    [checkWord],
  );

  return (
    <div className="App">
      <Header
        newGame={onNewGame}
        nthTryMax={nthTryMax}
        setNthTryMax={setNthTryMax}
        setWordLength={setWordLength}
        wordLength={wordLength}
      />
      <div>
        {seed.map((key, ix) => (
          <Row
            checkWord={onCheckWord}
            isDisabled={isWinner || isLoading || nthTry !== ix}
            key={key}
            wordLength={wordLength}
          />
        ))}
      </div>
      <Keyboard letterStatus={letterStatus} />
    </div>
  );
}

export default App;
