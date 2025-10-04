import { useQuery } from '@tanstack/react-query'
import { supabase } from '../utils/supabase'
import { Task } from '../types/types'

export const useQueryTasks = () => {
    const getTasks = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            throw new Error(error.message)
        }
        return data
    }

    return useQuery<Task[], Error>({
        queryKey: ['todos'],    // キャッシュのキー
        queryFn: getTasks,      // キャッシュのデータを取得する関数
        staleTime: Infinity,    // キャッシュの有効期限
    })
}

