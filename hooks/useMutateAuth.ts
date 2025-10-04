import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useMutation } from '@tanstack/react-query'

export const useMutateAuth = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const reset = () => {
        setEmail('')
        setPassword('')
    }

    // ログイン
    const loginMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signIn({ email, password })
            if (error) throw new Error(error.message)
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    // 新規登録
    const registerMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) throw new Error(error.message)
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })

    return {
        email,
        setEmail,
        password,
        setPassword,
        loginMutation,
        registerMutation,
    }
}
