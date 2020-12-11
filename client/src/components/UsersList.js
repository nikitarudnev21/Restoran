import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';

export default function UsersList({ users, setUsers }) {

    const { loading, request } = useHttp();
    const { token, logout } = useContext(AuthContext);
    const message = useMessage();
    const [copiedUsers, setCopiedUsers] = useState([]);
    const [editableUsers, setEditableUsers] = useState([]);
    const deleteUser = useCallback(async (id,role, email) => {
        try {
            const req = await request(`/api/users/delete/${id}`, 'DELETE', {id, role, email}, { Authorization: `Bearer ${token}` });
            setUsers(prev => prev.filter(user => user._id !== id));
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setUsers]);

    const deleteUsers = useCallback(async () => {
        try {
            const req = await request('/api/users/deleteall', 'DELETE', null, { Authorization: `Bearer ${token}` });
            if (req.deleted) {
                logout();
                setUsers([]);
            }
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setUsers]);

    const editUser = useCallback(async id => {
        try {
            const user = copiedUsers.find(c => c._id === id);
            if (user.address) {
                const req = await request(`/api/users/edit/${id}`, 'PATCH', { user }, { Authorization: `Bearer ${token}` });
                req.edited && editCancel(id);
                message(req.message);
            }
            else {
                message("Поля не могут быть пустыми");
            }
        } catch (e) { }
    }, [token, request, copiedUsers, message]);

    const editHandler = id => setEditableUsers(prev => [...prev, id]);
    const editCancel = id => setEditableUsers(prev => prev.filter(l => l !== id));

    const inputHandler = (value, id, type) => {
        const findedUser = copiedUsers.find(l => l._id === id);
        findedUser[type] = value;
        setCopiedUsers(prev => [...prev, findedUser]);
    };
    useEffect(() => {
        setCopiedUsers(users);
        console.log(users);
    }, [copiedUsers, setCopiedUsers, users])

    if (loading) {
        return <Loader />
    }
    return (
        <>
            
            { users.length ?
                <>
                <h3 className="center">Все пользователи</h3>
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Роль</th>
                            <th>День рождения</th>
                            <th>Исикукод</th>
                            <th>Эмайл</th>
                            <th>Адресс</th>
                            <th>Телефон</th>
                            <th style={{width: "400px"}}>Дествия <button style={{ marginLeft: "35px" }} className="btn red darken-1" onClick={() => deleteUsers()}>Удалить все</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            return (
                                editableUsers.some(l => l === user._id)
                                    ?
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td><input type="text" defaultValue={user.firstname} onChange={e => inputHandler(e.target.value, user._id, "firstname")} /></td>
                                        <td><input type="text" defaultValue={user.lastname} onChange={e => inputHandler(e.target.value, user._id, "lastname")} /></td>
                                        <td><input type="text" defaultValue={user.role} onChange={e => inputHandler(e.target.value, user._id, "role")} /></td>
                                        <td><input type="text" defaultValue={user.birth} onChange={e => inputHandler(e.target.value, user._id, "birth")} /></td>
                                        <td><input type="text" defaultValue={user.idcode} onChange={e => inputHandler(e.target.value, user._id, "idcode")} /></td>
                                        <td><input type="text" defaultValue={user.email} onChange={e => inputHandler(e.target.value, user._id, "email")} /></td>
                                        <td><input type="text" defaultValue={user.address} onChange={e => inputHandler(e.target.value, user._id, "address")} /></td>
                                        <td><input type="text" defaultValue={user.telephone} onChange={e => inputHandler(e.target.value, user._id, "telephone")} /></td>
                                        <td className="actions-link">
                                            <button className="btn red darken-2" onClick={() => deleteUser(user._id, user.role, user.email)}>Удалить</button>
                                            <button className="btn blue darken-1" onClick={() => editCancel(user._id)}>Отменить</button>
                                        </td>
                                    </tr>
                                    :
                                    <tr key={user._id}>
                                        <td>{++index}</td>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.role}</td>
                                        <td>{user.birth}</td>
                                        <td>{user.idcode}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.telephone}</td>
                                        <td className="actions-link">
                                            <button className="btn red darken-2" onClick={() => deleteUser(user._id, user.role, user.email)}>Удалить</button>
                                        </td>
                                    </tr>
                            )
                        })}
                    </tbody>
                </table>
                </>
                :
                <div className="no-links">
                    <p>Пользователей пока нет</p>
                </div>
            }
        </>
    )
}