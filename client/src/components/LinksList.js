import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';

export const LinksList = ({ links, setLinks }) => {

    const { loading, request } = useHttp();
    const { token } = useContext(AuthContext);
    const message = useMessage();
    const [copiedLinks, setCopiedLinks] = useState([]);
    const [editableLinks, setEditableLinks] = useState([]);
    const deleteLink = useCallback(async (id) => {
        try {
            const req = await request(`/api/link/delete/${id}`, 'DELETE', null, { Authorization: `Bearer ${token}` });
            setLinks(prev => prev.filter(link => link._id !== id));
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setLinks]);

    const deleteLinks = useCallback(async () => {
        try {
            const req = await request('/api/link/deleteall', 'DELETE', null, { Authorization: `Bearer ${token}` });
            req.deleted && setLinks([]);
            message(req.message);
        } catch (e) { }
    }, [token, request, message, setLinks]);

    const editLink = useCallback(async id => {
        try {
            const link = copiedLinks.find(c => c._id === id);
            if (link.from) {
                const req = await request(`/api/link/edit/${id}`, 'PATCH', { link }, { Authorization: `Bearer ${token}` });
                req.edited && editCancel(id);
                message(req.message);
            }
            else {
                message("Ссылка не может быть пустой");
            }
        } catch (e) { }
    }, [token, request, copiedLinks, message]);

    const editHandler = id => setEditableLinks(prev => [...prev, id]);
    const editCancel = id => setEditableLinks(prev => prev.filter(l => l !== id));

    const inputHandler = (value, id, type) => {
        const findedLink = copiedLinks.find(l => l._id === id);
        findedLink[type] = value;
        setCopiedLinks(prev => [...prev, findedLink]);
    };
    useEffect(() => {
        setCopiedLinks(links);
    }, [copiedLinks, setCopiedLinks, links])

    if (loading) {
        return <Loader />
    }
    return (
        <>
            { links.length ?
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Оригинальная</th>
                            <th>Сокращенная</th>
                            <th>Дествия <button style={{ marginLeft: "35px" }} onClick={() => deleteLinks()}>Удалить все</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map((link, index) => {
                            return (
                                editableLinks.some(l => l === link._id)
                                    ?
                                    <tr key={link._id}>
                                        <td>{index + 1}</td>
                                        <td> <input type="text" defaultValue={link.from} onChange={e => inputHandler(e.target.value, link._id, "from")} /></td>
                                        <td>{link.to}</td>
                                        <td className="actions-link">
                                            <Link to={`/detail/${link._id}`}>Открыть</Link>
                                            <button onClick={() => deleteLink(link._id)}>Удалить</button>
                                            <button onClick={() => editCancel(link._id)}>Отменить</button>
                                            <button onClick={() => editLink(link._id)}>Изменить</button>
                                        </td>
                                    </tr>
                                    :
                                    <tr key={link._id}>
                                        <td>{index + 1}</td>
                                        <td>{link.from}</td>
                                        <td>{link.to}</td>
                                        <td className="actions-link">
                                            <Link to={`/detail/${link._id}`}>Открыть</Link>
                                            <button onClick={() => deleteLink(link._id)}>Удалить</button>
                                            <button onClick={() => editHandler(link._id)}>Изменить</button>
                                        </td>
                                    </tr>
                            )
                        })}
                    </tbody>
                </table>
                :
                <div className="no-links">
                    <p>Ссылок пока нет</p>
                    <Link to={'/create/'}>Создать</Link>
                </div>
            }
        </>
    )
}