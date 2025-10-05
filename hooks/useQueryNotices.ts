import { useQuery } from '@tanstack/react-query'
import { supabase } from '../utils/supabase'
import { Notice } from '../types/types'

export const useQueryNotices = () => {
    const getNotices = async () => {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            throw new Error(error.message)
        }
        return data
    }

    // Noticesのデータを取得. 他ユーザーの変更があった場合にはリアルタイムでデータを取得する
    return useQuery<Notice[], Error>({
        queryKey: ['notices'],      // キャッシュのキー
        queryFn: getNotices,         // キャッシュのデータを取得する関数
        staleTime: 0,                // キャッシュの有効期限
        refetchOnWindowFocus: true,  // ウィンドウがフォーカスされた時にデータを再取得
    })
}

