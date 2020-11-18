import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // позволяет получать параметры из текущей ссылки
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { LinkCard } from '../components/LinkCard';
export const DetailPage = () => {
    const { token } = useContext(AuthContext);
    const [link, setLink] = useState(null);
    const { request, loading } = useHttp();
    const linkId = useParams().id; // берем из url id 

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, { // получаем конкретную ссылку
                Authorization: `Bearer ${token}`
            });
            setLink(fetched);
        } catch (e) { }
    }, [token, linkId, request]);

    useEffect(() => {
        getLink();
    }, [getLink])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && link && <LinkCard link={link} />}
        </>
    )
}