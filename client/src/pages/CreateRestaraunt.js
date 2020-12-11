import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export default function CreateRestaraunt(){
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [phone, setPhone] = useState(null);
    const [form, setForm] = useState({ name: "", address: "", telephone: "" });
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    setTimeout(() => {
        window.M.updateTextFields();
    }, 200);

    const changePhone = newPhone => {
        setPhone(newPhone);
        setForm({ ...form,  telephone: newPhone });
    }

    const createRestaraunt = async () => {
        try {
            const data = await request('/api/restaraunt/create', 'POST', { ...form, id: auth.userId, username: auth.name }, { Authorization: `Bearer ${auth.token}` });
            message(data.message);
        } catch (e) { }
    }

    return (
        <>
            <div className="row center" style={{marginTop: "10vh"}}>
                <div className="col s6 offset-s3">
                        <div className="card blue darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">Создать ресторан</span>
                                <div>
                                    <div className="input-field">
                                        <input placeholder="Введите название"
                                            id="firstname" type="text" className="validate yellow-input" name="name"
                                            onChange={e=>changeHandler(e)} value={form.name} />
                                        <label htmlFor="email">Название</label>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Уезд,Город,Улица,Дом"
                                            id="address" type="text" className="validate yellow-input" name="address"
                                            onChange={e=>changeHandler(e)} value={form.address} />
                                        <label htmlFor="address">Адресс</label>
                                    </div>
                                    <div className="input-field">
                                    <PhoneInput
                                        inputStyle={{ marginLeft: "42px", width: "91%" }}
                                        inputProps={{
                                            name: 'telephone',
                                            required: true,
                                            autoFocus: true
                                        }}
                                        value={phone}
                                        inputClass={"validate yellow-input"}
                                        onChange={newPhone => changePhone(newPhone)}
                                        />
                                    </div>
                                    <div className="card-action">
                                    <button className="btn grey lighten-1 black-text"
                                        onClick={createRestaraunt} disabled={loading}>Создать</button>
                                    </div>
                                </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}