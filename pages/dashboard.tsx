import { NextPage } from 'next'
import {useQueryClient} from '@tanstack/react-query'
import { LogoutIcon, StatusOnlineIcon, DocumentTextIcon } from '@heroicons/react/outline'
import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'
import { TaskList } from '../components/TaskList'
import { TaskForm } from '../components/TaskForm'
import { NoticeList } from '../components/NoticeList'
import { NoticeForm } from '../components/NoticeForm'

const Dashboard: NextPage = () => {
    const queryClient = useQueryClient()
    const signOut = () => {
        queryClient.clear()
        supabase.auth.signOut()
    }
    return (
        <Layout title="Dashboard">
            {/* <h1 className="text-xl font-bold">
                Now Login User: {supabase.auth.user()?.email}
            </h1> */}
            <div className="flex justify-center items-center space-x-4">
                <p className="text-lg">Logout</p>
                <LogoutIcon
                    className="h-6 w-6 cursor-pointer text-blue-500"
                    onClick={signOut}
                />
            </div>
            <div className="grid grid-cols-2 gap-40">
                <div>
                    <div className="my-3 flex justify-center">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <TaskForm />
                    <TaskList />
                </div>
                <div>
                    <div className="my-3 flex justify-center">
                        <StatusOnlineIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <NoticeForm />
                    <NoticeList />
                </div>
            </div>
        </Layout >
    )
}

export default Dashboard