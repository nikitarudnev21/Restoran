import React, { useState, useContext, useCallback, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import RestarauntsList from '../components/RestarauntsList';
export default function RestarauntsPage() {
    const [restaraunts, setRestaraunts] = useState([]);
    const { loading, request } = useHttp();
    const { token, userId, role } = useContext(AuthContext);
    const fetchRestaraunts = useCallback(async () => {
        try {
            const fetched = await request('/api/restaraunt', 'POST', {id:userId, role}, {
                Authorization: `Bearer ${token}`
            });
            setRestaraunts(fetched.restaraunts);
        } catch (e) { }
    }, [token, request]);
    useEffect(() => {
        fetchRestaraunts();
    }, [fetchRestaraunts]);
    if (loading) {
        return <Loader />
    }
    return (
        <>
            {role !== "Admin" && 
            <div className="row">
                <h5>Создайте ресторан</h5>
                <div className="col s8 offset s2" style={{ paddingTop: '2rem' }}>
                    <NavLink to="/createrest" className="btn blue darken-3">Создать ресторан</NavLink>
                </div>
            </div>}
            {!loading && <RestarauntsList restaraunts={restaraunts} setRestaraunts={setRestaraunts} />}
        </>
    )
}

