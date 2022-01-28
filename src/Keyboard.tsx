import { VoidFunctionComponent } from 'react';
import { Flag } from './useWordle';

const layout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface Props {
  letterStatus: Record<string, Flag>
}

export const Keyboard: VoidFunctionComponent<Props> = ({ letterStatus }) => {
  return (
    <div className="keyboard">
      {layout.map((row, ix) => (
        <div className="row" key={ix}>
          {row.map((key) => (
            <button className={letterStatus[key] ?? ''} key={key}>{key}</button>
          ))}
        </div>
      ))}
    </div>
  )
};

export default Keyboard;
