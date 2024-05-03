import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'

const HoveringToolbar = ({ editor }) => {
  const isHoveringToolbarDisabled = window.matchMedia('(max-width: 900px)').matches;
  return (
    <div>
      {isHoveringToolbarDisabled ? null
        :
        (
          <BubbleMenu className='hovering-toolbar' tippyOptions={{ duration: 100 }} editor={editor}>
            <BaseTools editor={editor}/>
          </BubbleMenu>
        )
      }
    </div>
  )
}

export default HoveringToolbar;