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

    // useQueryの実行結果オブジェクト{Tasks[],Error,isLoasing,...}を返す.
    // こうする事で呼び出し側から間接的にuseQueryを使う事ができる
    return useQuery<Task[], Error>({    // <Task[], Error>はuseQueryTasks戻り型のジェネリック
        queryKey: ['todos'],    // キャッシュのキー
        queryFn: getTasks,      // キャッシュのデータを取得する関数
        staleTime: 0,           // キャッシュの有効期限
    })
}

