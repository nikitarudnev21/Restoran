import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { RestarauntCard } from '../components/RestarauntCard';
export const DetailRestarauntPage = () => {
    const { token } = useContext(AuthContext);
    const [restaraunt, setRestaraunt] = useState(null);
    const { request, loading } = useHttp();
    const linkId = useParams().id;

    const getRestaraunt = useCallback(async () => {
        try {
            const fetched = await request(`/api/restaraunt/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setRestaraunt(fetched);
        } catch (e) { }
    }, [token, linkId, request]);

    useEffect(() => {
        getRestaraunt();
    }, [getRestaraunt])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && restaraunt && <RestarauntCard restaraunt={restaraunt} />}
        </>
    )
}