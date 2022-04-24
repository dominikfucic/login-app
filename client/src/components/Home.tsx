import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../AuthProvider';

export default function Home() {
    const auth = useAuth();

    return (
        <div className='m-auto border rounded p-6 flex flex flex-col bg-slate-50'>
            <h1 className='pb-6 text-xl'>Welcome {auth.user!.username}</h1>
            <button className='p-2 bg-slate-200 rounded mx-auto' onClick={() => auth.logout()}>Log out</button>

        </div>

    );
}
