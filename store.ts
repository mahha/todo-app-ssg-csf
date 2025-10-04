import  create from 'zustand'
import { EditedTask, EditedNotice } from './types/types'

type State = {
    editedTask: EditedTask
    editedNotice: EditedNotice
    updateEditedTask: (editedTask: EditedTask) => void
    updateEditedNotice: (editedNotice: EditedNotice) => void
    resetEditedTask: () => void
    resetEditedNotice: () => void
}

const useStore = create<State>((set: any) => ({
    editedTask: { id: '', title: '' },
    editedNotice: { id: '', content: '' },
    updateEditedTask: (payload: EditedTask) =>
        set({
            editedTask: {
                id: payload.id,
                title: payload.title
            },
        }),
    resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),
    updateEditedNotice: (payload: EditedNotice) =>
        set({
            editedNotice: {
                id: payload.id,
                content: payload.content
            },
        }),
    resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}))

export default useStore