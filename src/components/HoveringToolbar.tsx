import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'

const HoveringToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <BubbleMenu className='hovering-toolbar' tippyOptions={{ duration: 100 }} editor={editor}>
      <BaseTools editor={editor}/>
    </BubbleMenu>
  )
}

export default HoveringToolbar;