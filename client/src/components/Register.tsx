import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../AuthProvider';

export default function Register() {
    const auth = useAuth();
    const [state, setState] = useState({
        username: '',
        password: ''
    });

    function onChangeHandler(event: any) {
        auth.setError(null);
        setState(
            {
                ...state,
                [event.target.name]: event.target.value
            }
        );
    }

    return (
        <div className='m-auto'>
            <h1 className='text-lg pb-1'>Register</h1>
            <div className="flex flex-col p-8 gap-4 w-max m-auto bg-slate-100 rounded">
                {auth.error && <p className='text-red-500'>Username already exists</p>}
                <input className='border-2 rounded border-blue-500 w-60 p-2' type="username" placeholder='Username' name='username' onChange={onChangeHandler} value={state.username} />
                <input className='border-2 rounded border-blue-500 w-60 p-2' type="password" placeholder='Password' name='password' onChange={onChangeHandler} value={state.password} />
                <button className='bg-blue-500 hover:bg-blue-700 text-white rounded max-w-[8rem] py-1'
                    onClick={() => auth.register(state)}>Register</button>
                <Link className='underline w-max text-blue-700' to="/">Login</Link>
            </div>
        </div>
    );
}