import useLocalStorage from "use-local-storage";
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'
import { Editor } from "@tiptap/react";
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

import Drawing from "./components/DrawingExtension"
import SmilieReplacer from './components/SmilieReplacer'
import Document from './components/Document'
import ToggleDarkMode from './components/ToggleDarkMode';

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  
  const editor = new Editor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Typography,
      SmilieReplacer,
      Image,
      Dropcursor,
      Drawing,
      CharacterCount,
      Gapcursor,
    ],
    content: ``,
  })

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <ToggleDarkMode handleChange={() => setIsDark(!isDark)} isChecked={isDark}/>
      <Document editor={editor}/>
    </div>
  );
}

export default App
