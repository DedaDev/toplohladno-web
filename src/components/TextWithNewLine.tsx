import React, {FC} from 'react'


interface ITextWithNewLinesProps {
  text: string
}

const TextWithNewLines: FC<ITextWithNewLinesProps> = ({ text }) => {
  return (
    <div className="text-center">
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  )
}

export default TextWithNewLines
