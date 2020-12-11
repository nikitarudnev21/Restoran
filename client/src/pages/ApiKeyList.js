import React from 'react';
import { Loader } from '../components/Loader';
import { useHttp } from '../hooks/http.hook';

export default function ApiKeyList({ apikeys, setApikeys }) {
    const { loading  } = useHttp();
    if (loading) {
        return <Loader />
    }
    return (
        <>
            { apikeys.length ?
                <>
                <h3 className="center">Все ключи</h3>
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Ключ</th>
                            <th>Используеться</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apikeys.map((apikey, index) => {
                            return (
                                    <tr key={apikey.value}>
                                        <td>{++index}</td>
                                        <td>{apikey.value}</td>
                                        <td>{apikey.used ? "Да" : "Нет"}</td>
                                    </tr>
                            )
                        })}
                    </tbody>
                </table>
                </>
                :
                <div className="no-links">
                    <p>Ключей пока нет</p>
                </div>
            }
        </>
    )
}