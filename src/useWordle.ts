import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const words = {
  10: 76,
  4: 21,
  5: 50,
  6: 71,
  7: 97,
  8: 106,
  9: 91,
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const randomWordLine = getRandomInt(0, 25);

export type Flag = 'green' | 'yellow' | 'gray';

export interface WordChecker {
  (word: string): {
    isWinner: boolean;
    result: Flag[];
  };
}

function createWordChecker(
  word: string,
  wordLength: number,
  nthTryMax: number,
  nthTrySetter: (nthTry: number) => void,
): WordChecker {
  let nthTry = 0;
  const letters = word.toUpperCase().split('');

  return function wordChecker(receivedWord: string) {
    let isWinner = true;
    const receivedLetters = receivedWord.toUpperCase().split('');

    if (receivedLetters.length !== wordLength) {
      throw new Error('Invalid input word');
    }

    nthTry += 1;
    nthTrySetter(nthTry);

    if (nthTry > nthTryMax) {
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

    if (process.env.NODE_ENV !== 'production' && nthTry === nthTryMax) {
      console.log(word);
    }

    return {
      isWinner,
      result,
    };
  };
}

export default function useWordle(
  wordLength: keyof typeof words = 5,
  nthTryMax = 5,
): [isLoading: boolean, wordChecker: WordChecker, nthTry: number] {
  const [isLoading, setLoadingState] = useState(true);
  const [nthTry, setNthTry] = useState(0);
  const wordChecker = useRef<WordChecker>(createWordChecker('', wordLength, nthTryMax, setNthTry));
  const randomFileName = useMemo(() => getRandomInt(0, words[wordLength]), [wordLength]);

  const setWordChecker = useCallback(async () => {
    try {
      const file = await import(`./words/${wordLength}/${randomFileName}.json`);
      const word = Array.from(file)[randomWordLine] as string;

      wordChecker.current = createWordChecker(word, wordLength, nthTryMax, setNthTry);
    } catch (error) {
      await setWordChecker();
    }
  }, [nthTryMax, randomFileName, wordLength]);

  useEffect(() => {
    setLoadingState(true);

    setWordChecker().then(() => {
      setLoadingState(false);
    });
  }, [setWordChecker]);

  return [isLoading, wordChecker.current, nthTry];
}
