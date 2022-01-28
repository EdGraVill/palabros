import useWordle, { Flag } from './useWordle';
import Row from './Row';
import Keyboard from './Keyboard';
import { useCallback, useState } from 'react';

function App() {
  const [isLoading, checkWord, nthTry] = useWordle();
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
        <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== 0} />
        <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== 1} />
        <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== 2} />
        <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== 3} />
        <Row checkWord={onCheckWord} isDisabled={isWinner || isLoading || nthTry !== 4} />
        <Keyboard letterStatus={letterStatus} />
      </header>
    </div>
  );
}

export default App;
