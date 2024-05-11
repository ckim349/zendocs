import HoveringToolbar from './HoveringToolbar'
import { CustomEditor } from './DocumentPage';

const TextEditor = ({ editor }: {editor: CustomEditor}) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <HoveringToolbar editor={editor} />
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </>
  )
}

export default TextEditor