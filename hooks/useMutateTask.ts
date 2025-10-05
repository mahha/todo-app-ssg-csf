import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Task, EditedTask } from '../types/types'

export const useMutateTask = () => {
    const queryClient = useQueryClient()
    const reset = useStore((state) => state.resetEditedTask)

    const createTaskMutation = useMutation({
        mutationFn: async (task: Omit<Task, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('todos')
                .insert(task)
                .select()   // supabaseV2用にselect()を追加
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (res) => {   // resはmutationFnでreturnした値.つまり追加したデータ
            const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
            if (previousTodos) {
                queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
            }
            reset()
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    const updateTaskMutation = useMutation({
        mutationFn: async (task: EditedTask) => {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: task.title })
                .eq('id', task.id)
                .select()   // supabaseV2用にselect()を追加
            if (error) throw new Error(error.message)
            return data
        },
        // onSuccessはデータベース更新が成功した時に実行される
        // variablesはmutationFnに渡した引数.つまり更新したデータ
        onSuccess: (res, variables) => {
            const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
            if (previousTodos) {
                queryClient.setQueryData(
                    ['todos'],
                    previousTodos.map(task =>
                        task.id === variables.id ? res[0] : task
                    )
                )
            }
            reset()
        },
        // onErrorはデータベース更新が失敗した時に実行される
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    const deleteTaskMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id)
                .select()   // supabaseV2用にselect()を追加
            if (error) throw new Error(error.message)
            return data
        },
        // variablesはmutationFnに渡した引数.つまり削除したデータのid
        onSuccess: (_, variables) => {
            const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
            if (previousTodos) {
                queryClient.setQueryData(
                    ['todos'],
                    previousTodos.filter(task => task.id !== variables))
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
        createTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
    }
}