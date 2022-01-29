import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { Flag, WordChecker } from './useWordle';

interface Props {
  checkWord: WordChecker;
  isDisabled: boolean;
  wordLength?: number;
}

const Row: VoidFunctionComponent<Props> = ({ checkWord, isDisabled, wordLength = 5 }) => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<Flag[]>([]);
  const inputs = useRef<HTMLDivElement[]>(Array.from({ length: wordLength }));

  const onDocumentKeyup = useCallback((event: globalThis.KeyboardEvent) => {
      const newLetter = (event.key ?? '').toUpperCase();

      if (event.key === 'Backspace') {
        setWord((currentWord) => currentWord.length ? currentWord.substring(0, currentWord.length - 1) : '');
      } else if (event.key === 'Enter') {
        setWord((currentWord) => {
          if (currentWord.length === wordLength) {
            setResult((currentResult) => currentResult.length ? currentResult : checkWord(currentWord).result);
          }

          return currentWord;
        });
      } else if (newLetter.length === 1 && /[A-ZÑ]/.test(newLetter)) {
        setWord((currentWord) => currentWord.length < wordLength ? `${currentWord ?? ''}${newLetter}` : currentWord);
      }
  }, [checkWord, wordLength]);

  useEffect(() => {
    if (!isDisabled) {
      document.addEventListener('keyup', onDocumentKeyup);

      return () => {
        document.removeEventListener('keyup', onDocumentKeyup);
      }
    }
  }, [isDisabled, onDocumentKeyup]);

  useEffect(() => {
    if (word.length < wordLength) {
      inputs.current[word.length].focus();
    }
  }, [word, wordLength]);

  useEffect(() => {
    if (!isDisabled) {
      inputs.current[0].focus();
    }
  }, [isDisabled]);

  return (
    <div className='row'>
      {inputs.current.map((_, ix) => (
        <div
          className={classNames([
            'cell',
            result[ix] ?? '',
            { focus: !isDisabled && (word.length === ix || (word.length - 1 === ix && ix === wordLength - 1)) },
          ])}
          key={ix}
          ref={element => inputs.current[ix] = element!}
        >
          {word[ix] ?? ''}
        </div>
      ))}
    </div>
  )
}

export default Row;
