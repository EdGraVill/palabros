import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState, VoidFunctionComponent } from 'react';
import { Flag, WordChecker } from './useWordle';

interface Props {
  checkWord: WordChecker;
  isDisabled: boolean;
  wordLength?: number;
}

const Row: VoidFunctionComponent<Props> = ({ checkWord, isDisabled, wordLength = 5 }) => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<Flag[]>([]);
  const inputs = useRef<HTMLInputElement[]>(Array.from({ length: wordLength }));

  const onFocus = useCallback(() => {
    inputs.current[word.length >= wordLength ? wordLength - 1 : word.length].focus();
  }, [word, wordLength]);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newLetter = (event.currentTarget.value ?? '').toUpperCase();
    
    if (/[A-ZÑ]/.test(newLetter)) {
      setWord((currentValue) => currentValue.length < wordLength ? `${currentValue ?? ''}${newLetter}` : currentValue);
    }
  }, [wordLength]);
  
  const onKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      setWord((currentValue) => currentValue.length ? currentValue.substring(0, currentValue.length - 1) : '');
    }

    if (event.key === 'Enter' && word.length === wordLength) {
      setResult(checkWord(word).result);
    }
  }, [word, checkWord, wordLength]);

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
        <input
          className={result[ix] ?? ''}
          disabled={isDisabled}
          key={ix}
          onChange={onChange}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          ref={element => inputs.current[ix] = element!}
          type="text"
          value={word[ix] ?? ''}
        />
      ))}
    </div>
  )
}

export default Row;
