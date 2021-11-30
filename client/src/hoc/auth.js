import { Axios } from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

export default function (SpecificComponent, option, adminRoute = null) {

    //option 내용
    //null => 아무나 출입이 가능한 페이지
    //true => 로그인 한 유저만 출입이 가능한 페이지
    //false => 로그인 한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                //로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login');
                    }
                } else {
                    //로그인 한 상태
                    //admin이 아닌데 admin만 들어갈 수 있는 페이지를 들어가려고 하는 경우
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    } else {
                        //option이 false일때, 
                        //로그인 한 유저가 출입 불가능한 페이지를 가려고 할때
                        if (option === false)
                            props.history.push('/');
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent></SpecificComponent>
        )
    }

    return AuthenticationCheck
}