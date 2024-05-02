import { EditorContent, EditorProvider } from '@tiptap/react'

import TextEditor from './TextEditor'
import Toolbar from './Toolbar'

const Document = ({ editor }) => {
  return (
    <div>
      <Toolbar editor={editor}/>
      <div className='document'>
        <EditorContent editor={editor} /> 
        <TextEditor editor={editor} />
      </div>
    </div>

  )
}

export default Document