import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
  /**
   * The types where the line height attribute can be applied.
   * @default ['paragraph', 'heading', 'list_item']
   * @example ['heading', 'paragraph']
   */
  types: string[],

  /**
   * The heights which are allowed.
   * @default [1.5, 2.0]
   * @example [2.0, 4.0]
   */
  heights: number[],

  /**
   * The default height.
   * @default 1.5
   * @example 1.6
   */
  defaultHeight: number,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height attribute
       * @param height The height
       * @example editor.commands.setLineHeight(1.1)
       */
      setLineHeight: (height: number) => ReturnType,
      /**
       * Unset the line height attribute
       * @example editor.commands.unsetLineHeight()
       */
      unsetLineHeight: () => ReturnType,
    }
  }
}

/**
 * This extension allows you to change text line height
 */
export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'list_item'],
      heights: [1.5, 2.0],
      defaultHeight: 1.5,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultHeight) {
                return {}
              }

              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: (height: number) => ({ commands }) => {
        if (!this.options.heights.includes(height)) {
          return false
        }

        return this.options.types
          .map(type => commands.updateAttributes(type, { lineHeight: height }))
          .every(response => response)
      },

      unsetLineHeight: () => ({ commands }) => {
        return this.options.types
          .map(type => commands.resetAttributes(type, 'lineHeight'))
          .every(response => response)
      },
    }
  },
})