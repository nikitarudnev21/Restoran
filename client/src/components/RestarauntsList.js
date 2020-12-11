import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';

export default function RestarauntsList({ restaraunts, setRestaraunts }) {

    const { loading, request } = useHttp();
    const { token, role, userId } = useContext(AuthContext);
    const message = useMessage();
    const [copiedRestaraunts, setCopiedRestaraunts] = useState([]);
    const [editableRestaraunts, setEditableRestaraunts] = useState([]);
    const deleteRestaraunt = useCallback(async id => {
        try {
            const req = await request(`/api/restaraunt/delete/${id}`, 'DELETE', {ownerId: userId, role}, { Authorization: `Bearer ${token}` });
            setRestaraunts(prev => prev.filter(restaraunt => restaraunt._id !== id));
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setRestaraunts]);

    const deleteRestaraunts = useCallback(async () => {
        try {
            const req = await request('/api/restaraunt/deleteall', 'DELETE', {ownerId: userId, role}, { Authorization: `Bearer ${token}` });
            req.deleted && setRestaraunts([]);
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setRestaraunts]);

    const editRestaraunt = useCallback(async id => {
        try {
            const restaraunt = copiedRestaraunts.find(c => c._id === id);
            if (restaraunt.name && restaraunt.address && restaraunt.ownername) {
                const req = await request(`/api/restaraunt/edit/${id}`, 'PATCH', { restaraunt }, { Authorization: `Bearer ${token}` });
                req.edited && editCancel(id);
                message(req.message);
            }
            else {
                message("Поля не могут быть пустыми");
            }
        } catch (e) { }
    }, [token, request, copiedRestaraunts, message]);

    const editHandler = id => setEditableRestaraunts(prev => [...prev, id]);
    const editCancel = id => setEditableRestaraunts(prev => prev.filter(l => l !== id));

    const inputHandler = (value, id, type) => {
        const findedRestaraunt = copiedRestaraunts.find(l => l._id === id);
        findedRestaraunt[type] = value;
        setCopiedRestaraunts(prev => [...prev, findedRestaraunt]);
    };
    useEffect(() => {
        setCopiedRestaraunts(restaraunts);
        console.log(restaraunts);
    }, [copiedRestaraunts, setCopiedRestaraunts, restaraunts])

    if (loading) {
        return <Loader />
    }
    return (
        <>
            {restaraunts.length ? <h3 className="center">{role === "Owner" ? "Ваши" : "Все"} рестораны</h3> : <></>}
            { restaraunts.length ?
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Название</th>
                            <th>Адресс</th>
                            <th>Телефон</th>
                            <th>Владелец</th>
                            <th>Дествия <button style={{ marginLeft: "35px" }} className="btn red darken-1" onClick={() => deleteRestaraunts()}>Удалить все</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaraunts.map((restaraunt, index) => {
                            return (
                                editableRestaraunts.some(l => l === restaraunt._id)
                                    ?
                                    <tr key={restaraunt._id}>
                                        <td>{index + 1}</td>
                                        <td><input type="text" defaultValue={restaraunt.name} onChange={e => inputHandler(e.target.value, restaraunt._id, "name")} /></td>
                                        <td><input type="text" defaultValue={restaraunt.address} onChange={e => inputHandler(e.target.value, restaraunt._id, "address")} /></td>
                                        <td><input type="text" defaultValue={restaraunt.telephone} onChange={e => inputHandler(e.target.value, restaraunt._id, "telephone")} /></td>
                                        <td>{restaraunt.ownername}</td>
                                        <td className="actions-link">
                                            <button className="btn red darken-2" onClick={() => deleteRestaraunt(restaraunt._id)}>Удалить</button>
                                            <button className="btn blue darken-1" onClick={() => editCancel(restaraunt._id)}>Отменить</button>
                                            <button className="btn waves-effect waves-light" style={{marginTop:"15px"}} type="submit" name="action" onClick={() => editRestaraunt(restaraunt._id)}>Изменить</button>
                                        </td>
                                    </tr>
                                    :
                                    <tr key={restaraunt._id}>
                                        <td>{++index}</td>
                                        <td>{restaraunt.name}</td>
                                        <td>{restaraunt.address}</td>
                                        <td>{restaraunt.telephone}</td>
                                        <td>{restaraunt.ownername}</td>
                                        <td className="actions-link">
                                            <button className="btn red darken-2" onClick={() => deleteRestaraunt(restaraunt._id)}>Удалить</button>
                                            <button  className="btn blue darken-1" onClick={() => editHandler(restaraunt._id)}>Изменить</button>
                                        </td>
                                    </tr>
                            )
                        })}
                    </tbody>
                </table>
                :
                <div className="no-links">
                    <p>Ресторанов пока нет</p>
                </div>
            }
        </>
    )
}