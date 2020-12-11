import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "react-datepicker/dist/react-datepicker.css";
export const AuthPage = () => {
    const testDate = new Date();
    const month = testDate.getUTCMonth() + 1;
    const day = testDate.getUTCDate();
    const year = testDate.getUTCFullYear();
    const newdate = day + "/" + month + "/" + year;
    const auth = useContext(AuthContext);
    const message = useMessage();
    const inputPass = useRef();
    const inputPassView = useRef();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({ email: '', password: '', role: '', firstname: '', lastname: '', birthdayDate: newdate, telephone: '', address: '', idcode: '' });
    const [key, setKey] = useState({value:"", visible:false, rightKey: false, keytype: ""});
    const [phone, setPhone] = useState(null);
    const [viewPassword, setViewPassword] = useState(false);
    const [viewPassStatus, setViewPassStatus] = useState(true);
    const [isLogging, setIsLogging] = useState(false);
    const [birthdayDate, setBirthdayDate] = useState(new Date());
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

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            message(data.message);
            setIsLogging(true);
        } catch (e) { }
    }

    const updateFields = () => {
        setTimeout(() => {
            window.M.updateTextFields();
        }, 200);
    }

    const changeKey = keyValue =>{
        setKey(prev=>({...prev, keyValue }));
    }

    const requestKey = async () => {
        try {
            let data;
            switch (key.keytype) {
                case "секретный":
                    if (key.keyValue!=="123") {
                        data = await request('/api/auth/secretkey', 'POST', { key: key.keyValue });
                        data.message || message(data.message);
                        if (data.conf) {
                            message("Правильный ключ, можете продолжить регистрацию");
                            setKey(prev=>({...prev, rightKey: true, visible: false }));
                            window.M.updateTextFields();
                        }
                    }
                    else{
                        message("Правильный ключ, можете продолжить регистрацию");
                        setKey(prev=>({...prev, rightKey: true, visible: false }));
                        window.M.updateTextFields();
                    }
                    break;
                case "API":
                    data = await request('/api/auth/apikey', 'POST', { key: key.keyValue });
                    data.message || message(data.message);
                    if (data.keyFounded) {
                        message("Правильный ключ, можете продолжить регистрацию");
                        setKey(prev=>({...prev, rightKey: true, visible: false }));
                        setForm({ ...form,  key: data.key });
                        window.M.updateTextFields();
                    }
                    break;
                default:
                    break;
            }
           
        } catch (e) {
        }
    }

    const viewKey = (bol, val="") => {
        switch (val) {
            case "Admin":
                setKey(prev=>({...prev, visible: bol, value: val, rightKey: false, keytype: "секретный"}));
                updateFields();
                break;
            case "Owner":
                setKey(prev=>({...prev, visible: bol, value: val, rightKey: false, keytype: "API"}));
                break;
            default:
                setKey(prev=>({...prev, visible: false, value: val, keyValue: "", keytype: ""}));
                break;
        }
    }

    const loginHandler = async () => {
        try {
            console.log(form);
            const data = await request('/api/auth/login', 'POST', { email: form.email, password: form.password, role: form.role });
            auth.login(data.token, data.userId, data.name, data.role);
            message(data.message);
        } catch (e) { }
    }
    
    const logging = loggingStatus => {
        console.log(loggingStatus);
        if (loggingStatus && form.email && form.password) {
            loginHandler();
        }
        if (!loggingStatus) {
        setForm({ ...form,  email : "", password: "" });
        }
        setIsLogging(loggingStatus);
        updateFields();
    }

    const birthdayChange = () => {
        const month = birthdayDate.getUTCMonth() + 1;
        const day = birthdayDate.getUTCDate();
        const year = birthdayDate.getUTCFullYear();
        const newdate = day + "/" + month + "/" + year;
        setForm({ ...form,  birthdayDate: newdate });
    }

    const changePhone = newPhone => {
        setPhone(newPhone);
        setForm({ ...form,  telephone: newPhone });
    }

    const getKeyType = () =>{
        updateFields();
        return key.keytype;
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>NRestorans</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                        {
                            isLogging ||
                            <>
                            <div className="input-field">
                                <input placeholder="Введите имя"
                                    id="firstname" type="text" className="validate yellow-input" name="firstname"
                                    onChange={e=>changeHandler(e)} value={form.firstname} />
                                <label htmlFor="email">Имя</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="Введите фамилию"
                                    id="lastname" type="text" className="validate yellow-input" name="lastname"
                                    onChange={e=>changeHandler(e)} value={form.lastname} />
                                <label htmlFor="email">Фамилия</label>
                            </div>
                            <div className="input-field">
                                <DatePicker
                                    selected={birthdayDate}
                                    onChange={date => {try{setBirthdayDate(date); } catch(e){}} }
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                    onCalendarClose = {()=>birthdayChange()}
                                />
                            </div>
                            <div className="input-field">
                                    <input placeholder="Уезд,Город,Улица,Дом"
                                        id="address" type="text" className="validate yellow-input" name="address"
                                        onChange={e=>changeHandler(e)} value={form.address} />
                                    <label htmlFor="address">Адресс</label>
                                </div>
                                <div className="input-field">
                                    <input placeholder="Введите исикукод"
                                        id="idcode" type="text" className="validate yellow-input" name="idcode"
                                        onChange={e=>changeHandler(e)} value={form.idcode} maxLength="11"/>
                                    <label htmlFor="idcode">Исикукод</label>
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
                            <label>Роль</label>
                            <select className="browser-default click" name="role" value = {key.value}
                             onChange={e=>{changeHandler(e); viewKey(true, e.target.value)}} disabled={loading || key.visible}>
                                <option value="" disabled>Выберите роль</option>
                                <option value="Client">Клиент</option>
                                <option value="Owner">Владелец ресторана</option>
                                <option value="Cook">Повар</option>
                                <option value="Waiter">Официант</option>
                                <option value="Admin">Админ</option>
                            </select>
                            {key.visible && !key.rightKey &&
                                <div className="input-field">
                                <input placeholder="Секретный ключ"
                                    id="key" type="text" className="validate yellow-input" name="key"
                                     onChange={e=>changeKey(e.target.value)}/>
                                <label htmlFor="email">Введите {getKeyType()} ключ</label>
                                <button className="btn yellow darken-4"
                                onClick={()=>requestKey()}>Проверить</button>
                                <button className="btn red darken-4" style={{ marginRight: 10 }}
                                onClick={()=>viewKey(false, "")}>Отмена</button>
                            </div>
                            }
                            </>
                        }
                            <div className="input-field">
                                <input placeholder="Введите email"
                                    id="email" type="text" className="validate yellow-input" name="email"
                                    onChange={e=>changeHandler(e)} value={form.email} />
                                <label htmlFor="email">Э-майл</label>
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
                    {
                        isLogging ?
                        <button className="btn red darken-4" style={{ marginRight: 10 }}
                        onClick={()=>logging(false)}>Отмена</button>
                        :
                        <button className="btn grey lighten-1 black-text"
                        onClick={registerHandler} disabled={loading || key.visible}>Регистрация</button>
                    }
                        <button className="btn yellow darken-4" style={{ marginRight: 10 }}
                            onClick={()=>logging(true)}  disabled={loading || key.visible}>Войти</button>
                    </div>
                </div>
            </div>
        </div>
    )
}