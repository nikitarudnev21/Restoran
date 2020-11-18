import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const inputPass = useRef();
    const inputPassView = useRef();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({ email: '', password: '' });
    const [viewPassword, setViewPassword] = useState(false);
    const [viewPassStatus, setViewPassStatus] = useState(true);

    // если возникла ошибка то выводим ее на экран
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])
    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        window.M.updateTextFields();
        window.addEventListener("click", e => {
            if (e.target !== inputPass.current) {
                setViewPassword(false);
            }
            if (e.target === inputPassView.current) {
                setViewPassword(true);
            }
        })
    }, []);

    // создаем пользователя    
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            message(data.message);
        } catch (e) { }
    }

    // логинимся в систему пользователя    
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form });
            auth.login(data.token, data.userId);
            message(data.message);
        } catch (e) { }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Введите email"
                                    id="email" type="text" className="validate yellow-input" name="email"
                                    onChange={changeHandler} value={form.email} />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field" style={{ display: "flex" }}
                                onMouseOver={() => setViewPassword(true)} onMouseLeave={() => setViewPassword(false)}>
                                <input placeholder="Введите пароль" id="password"
                                    type={viewPassStatus ? "password" : "text"} className="validate yellow-input" name="password" ref={inputPass}
                                    onChange={changeHandler} disabled={loading} value={form.password} />
                                <img src={`https://rudnev19.thkit.ee/php/ToDoList/img/eye${viewPassStatus}.png`}
                                    alt="View password" className="viewpassword" ref={inputPassView}
                                    style={{ opacity: viewPassword ? 1 : 0, cursor: viewPassword ? "pointer" : "default" }}
                                    onClick={() => setViewPassStatus(prev => !prev)} />
                                <label htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4" style={{ marginRight: 10 }}
                            onClick={loginHandler}>Войти</button>
                        <button className="btn grey lighten-1 black-text"
                            onClick={registerHandler} disabled={loading}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}