import { useCallback, useEffect, useRef, useState } from 'react';

const randomFileName = Math.abs(Math.floor(Math.random() * 131) - 1);
const randomWordLine = Math.abs(Math.floor(Math.random() * 26) - 1);

export type Flag = 'green' | 'yellow' | 'gray';

export interface WordChecker {
  (word: string): {
    result: Flag[];
    isWinner: boolean;
  }
}

function createWordChecker(word: string, nthTrySetter: (nthTry: number) => void): WordChecker {
  let nthTry = 0;
  const letters = word.toUpperCase().split('');

  return function wordChecker(receivedWord: string) {
    let isWinner = true;
    const receivedLetters = receivedWord.toUpperCase().split('');

    if (receivedLetters.length !== 5) {
      throw new Error('Invalid input word');
    }

    nthTry += 1;
    nthTrySetter(nthTry);
    
    if (nthTry > 5) {
      throw new Error('You loose');
    }

    const result = receivedLetters.map((letter, ix): Flag => {
      if (letter === letters[ix]) {
        return 'green';
      }

      isWinner = false;

      if (letters.includes(letter)) {
        return 'yellow';
      }

      return 'gray';
    });

    if (nthTry === 5) {
      console.log(word)
    }

    return {
      isWinner,
      result,
    }
  }
}

export default function useWordle(): [isLoading: boolean, wordChecker: WordChecker, nthTry: number] {
  const [isLoading, setLoadingState] = useState(true);
  const [nthTry, setNthTry] = useState(0);
  const wordChecker = useRef<WordChecker>(createWordChecker('', setNthTry));

  const setWordChecker = useCallback(async () => {
    try {
      const file = await import(`./words/${randomFileName}.json`);
      const word = Array.from(file)[randomWordLine] as string;

      wordChecker.current = createWordChecker(word, setNthTry);
    } catch (error) {
      await setWordChecker();
    }
  }, []);

  useEffect(() => {
    setWordChecker().then(() => {
      setLoadingState(false);
    })
  }, [setWordChecker]);

  return [isLoading, wordChecker.current, nthTry];
}
