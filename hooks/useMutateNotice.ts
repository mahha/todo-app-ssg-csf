import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Notice, EditedNotice } from '../types/types'

export const useMutateNotice = () => {
    const queryClient = useQueryClient()
    const reset = useStore((state) => state.resetEditedNotice)

    const createNoticeMutation = useMutation({
        mutationFn: async (Notice: Omit<Notice, 'id' | 'created_at'>) => {
            const { data, error } = await supabase.from('notices').insert(Notice)
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (res) => {
            const previousNottices = queryClient.getQueryData<Notice[]>(['notices'])
            if (previousNottices) {
                queryClient.setQueryData(['notices'], [...previousNottices, res[0]])
            }
            reset()
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    const updateNoticeMutation = useMutation({
        mutationFn: async (Notice: EditedNotice) => {
            const { data, error } = await supabase
                .from('notices')
                .update({ content: Notice.content })
                .eq('id', Notice.id)
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (res, variables) => {
            const previousNottices = queryClient.getQueryData<Notice[]>(['notices'])
            if (previousNottices) {
                queryClient.setQueryData(
                    ['notices'],
                    previousNottices.map(Notice =>
                        Notice.id === variables.id ? res[0] : Notice
                    )
                )
            }
            reset()
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    const deleteNoticeMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase.from('notices').delete().eq('id', id)
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (_, variables) => {
            const previousNottices = queryClient.getQueryData<Notice[]>(['notices'])
            if (previousNottices) {
                queryClient.setQueryData(
                    ['notices'],
                    previousNottices.filter(Notice => Notice.id !== variables))
            }
            reset()
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    // カスタムフックとして返却
    return {
        createNoticeMutation,
        updateNoticeMutation,
        deleteNoticeMutation,
    }
}