import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'

const HoveringToolbar = ({ editor }) => {
  return (
    <BubbleMenu tippyOptions={{ duration: 100 }} editor={editor}>
      <BaseTools editor={editor}/>
    </BubbleMenu>
  )
}

export default HoveringToolbar;