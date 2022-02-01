import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomInt } from './util';

export const words = {
  10: 76,
  4: 21,
  5: 50,
  6: 71,
  7: 97,
  8: 106,
  9: 91,
};

export type WordLength = keyof typeof words;

export type Flag = 'green' | 'yellow' | 'gray';

export interface WordChecker {
  (word: string): {
    isWinner: boolean;
    result: Flag[];
    rightWord?: string;
  };
}

function createWordChecker(
  word: string,
  wordLength: WordLength,
  nthTryMax: number,
  nthTrySetter: (nthTry: number) => void,
): WordChecker {
  let nthTry = 0;
  const letters = word.toUpperCase().split('');

  if (process.env.NODE_ENV !== 'production' && word) {
    console.log(`CURRENT WORD: ${word}`);
  }

  return function wordChecker(receivedWord: string) {
    let isWinner = true;
    const receivedLetters = receivedWord.toUpperCase().split('');

    if (receivedLetters.length !== wordLength) {
      throw new Error('Invalid input word');
    }

    nthTry += 1;
    nthTrySetter(nthTry);

    if (nthTry > nthTryMax) {
      return {
        isWinner: false,
        result: [],
        rightWord: word,
      };
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

    return {
      isWinner,
      result,
      rightWord: word === receivedWord || nthTry === nthTryMax ? word : undefined,
    };
  };
}

export default function useWordle(
  wordLength: WordLength = 5,
  nthTryMax = 5,
): [isLoading: boolean, wordChecker: WordChecker, nthTry: number, newGame: () => void] {
  const [isLoading, setLoadingState] = useState(true);
  const [nthTry, setNthTry] = useState(0);
  const wordChecker = useRef<WordChecker>(createWordChecker('', wordLength, nthTryMax, setNthTry));

  const setWordChecker = useCallback(async (reqWordLength: WordLength, reqNthTryMax: number) => {
    setNthTry(0);

    try {
      const baitFiles = await Promise.all(
        Array.from({ length: 5 }).map(
          async () => import(`./words/${reqWordLength}/${getRandomInt(0, words[reqWordLength])}.json`),
        ),
      );
      const word = Array.from(baitFiles[getRandomInt(0, 5)])[getRandomInt(0, 25)] as string;

      wordChecker.current = createWordChecker(word, reqWordLength, reqNthTryMax, setNthTry);
    } catch (error) {
      await setWordChecker(reqWordLength, reqNthTryMax);
    }
  }, []);

  const newGame = useCallback(async () => {
    setNthTry(0);
    setLoadingState(true);

    await setWordChecker(wordLength, nthTryMax);

    setLoadingState(false);
  }, [setWordChecker, wordLength, nthTryMax]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  return [isLoading, wordChecker.current, nthTry, newGame];
}
