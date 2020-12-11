import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import UsersList from '../components/UsersList';
export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const { loading, request } = useHttp();
    const { token } = useContext(AuthContext);
    const fetchUsers = useCallback(async () => {
        try {
            const fetched = await request('/api/users', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setUsers(fetched.users);
        } catch (e) { }
    }, [token, request]);
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    if (loading) {
        return <Loader />
    }
    return (
        <>
            {!loading && <UsersList users={users} setUsers={setUsers} />}
        </>
    )
}

