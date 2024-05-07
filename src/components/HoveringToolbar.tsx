import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'
import { CustomEditor } from './Document';

const HoveringToolbar = ({ editor }: {editor: CustomEditor}) => {
  if (!editor) {
    return null;
  }

  const isHoveringToolbarDisabled = window.matchMedia('(max-width: 900px)').matches;

  return (
    <BubbleMenu className='hovering-toolbar' tippyOptions={{ duration: 100 }} editor={editor}>
      {isHoveringToolbarDisabled ? null
        :
        (
          <BaseTools editor={editor}/>
        )
      }
    </BubbleMenu>
  )
}

export default HoveringToolbar;