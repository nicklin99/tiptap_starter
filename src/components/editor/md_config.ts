import Image from '@tiptap/extension-image'

export const InlineImage = Image.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            inline: true,
        }
    }
})