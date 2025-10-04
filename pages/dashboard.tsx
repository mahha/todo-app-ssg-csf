import { NextPage } from 'next'
import { LogoutIcon } from '@heroicons/react/outline'
import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'

const Dashboard: NextPage = () => {
    const signOut = async () => {
        await supabase.auth.signOut()
    }
    return (
        <Layout title="Dashboard">
            <LogoutIcon
                className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
                onClick={signOut}
            />
        </Layout>
    )
}

export default Dashboard