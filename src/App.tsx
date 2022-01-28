import useWordle, { Flag } from './useWordle';
import Row from './Row';
import Keyboard from './Keyboard';
import { useCallback, useState } from 'react';

function App() {
  const [nthTryMax, setNthTryMax] = useState(5);
  const [isLoading, checkWord, nthTry] = useWordle(5, nthTryMax);
  const [isWinner, setWinnerState] = useState(false);
  const [letterStatus, setLetterStatus] = useState<Record<string, Flag>>({})

  const onCheckWord = useCallback((word: string) => {
    const result = checkWord(word);

    setLetterStatus((currentStatus) => ({
      ...word.split('').reduce((acc, letter, ix) => {
        if (
          !currentStatus[letter] || currentStatus[letter] === 'gray' ||
          (currentStatus[letter] === 'yellow' && result.result[ix] === 'green')
        ) {
          return { ...acc, [letter]: result.result[ix] };
        }

        return acc;
      }, currentStatus),
    }))

    setWinnerState(result.isWinner);

    return result;
  }, [checkWord])

  return (
    <div className="App">
      <header className="container">
        {Array.from({ length: nthTryMax }).map((_, ix) => (
          <Row checkWord={onCheckWord} key={ix} isDisabled={isWinner || isLoading || nthTry !== ix} />
        ))}
        <Keyboard letterStatus={letterStatus} />
      </header>
    </div>
  );
}

export default App;
