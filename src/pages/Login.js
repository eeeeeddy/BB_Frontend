import React, { useEffect, useState } from 'react';
import { PC, Mobile } from '../components/Responsive';
import { Link, useNavigate } from 'react-router-dom';
import '../style/css/Login.css';
// import { GoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useResetRecoilState } from 'recoil';
import { currentVideoTitleAtom, videoPlaylistAtom } from '../state/MusicPlayerAtom';

function Login() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState([]);
    const navigate = useNavigate();
    const clientId = '293049760557-j0ki70fdjtfcltgd712dtghlf8gntq33.apps.googleusercontent.com';
    const setVideoPlayList = useResetRecoilState(videoPlaylistAtom);
    const setCurrentVideoTitle = useResetRecoilState(currentVideoTitleAtom);

    // const handleLogin = () => {
    //     setIsLogin(true);
    //     navigate("/");
    // };

    const openSignUp = () => {
        setIsLogin(true);
        navigate("/signup");
    }

    function onChange(event) {
        if (event.target.name === "email") {
            setEmail(event.target.value);
        } else if (event.target.name === "password") {
            setPassword(event.target.value);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/users/reissue`, {
                accessToken: window.localStorage.accessToken,
                refreshToken: window.localStorage.refreshToken
            });

            if (response.data.state === 200) {
                const newAccessToken = response.data.data.accessToken;
                const newRefreshToken = response.data.data.refreshToken;
                window.localStorage.setItem("accessToken", newAccessToken);
                window.localStorage.setItem("refreshToken", newRefreshToken);
                console.log("토큰 갱신 성공");

                setTimeout(() => {
                    refreshAccessToken();
                }, 4 * 60 * 1000);

            } else {
                console.log("토큰 정보 갱신 실패");
            }
        } catch (error) {
            console.log("토큰 갱신 API 호출 중 오류:", error);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const newErrorMessages = [];
        if (email === "") {
            newErrorMessages.push("이메일을 입력하세요.");
        }
        if (password === "") {
            newErrorMessages.push("비밀번호를 입력하세요.");
        }

        setErrorMessage(newErrorMessages);

        if (newErrorMessages.length === 0) {

            // const currentTime = new Date().toLocaleString();
            // window.localStorage.setItem("lastLoginTime", currentTime);

            await axios.post(
                `http://localhost:8080/api/v1/users/login`, {
                email: email,
                password: password,
                headers: {
                    'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
                },
            })
                .then((response) => {
                    if (response.data.state === 200) {
                        console.log("로그인 성공", response);
                        setIsLogin(true);
                        const accessToken = response.data.data.accessToken;
                        const refreshToken = response.data.data.refreshToken;
                        const nickName = response.data.data.nickName;
                        window.localStorage.setItem("email", email);
                        window.localStorage.setItem("nickName", nickName);
                        window.localStorage.setItem('isLogin', true);
                        window.localStorage.setItem("accessToken", accessToken);
                        window.localStorage.setItem("refreshToken", refreshToken);
                        // navigate("/");
                        window.location.reload();

                        setTimeout(() => {
                            refreshAccessToken();
                        }, 4 * 60 * 1000);

                        setVideoPlayList([]);
                        setCurrentVideoTitle('');

                    } else if (response.data.message === "비밀번호가 일치하지 않습니다.") {
                        console.log("로그인 실패");
                        alert("비밀번호가 일치하지 않습니다.");
                    } else {
                        console.log("로그인 실패");
                        alert("가입되지 않은 아이디입니다.")
                    }
                })
                .catch((error) => {
                    // setEmail("");
                    // setPassword("");
                    console.log("로그인 API 호출 중 호류: ", error);
                })
        }
    }

    return (
        <div>
            <PC>
                <div className='container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className='content'>
                        <div>
                            <div className="form-ui">
                                <form className='form' onSubmit={onSubmit}>
                                    <div className="form-body">
                                        <div className="welcome-lines">
                                            <div className="welcome-line-1">BeatBuddy</div>
                                            <div className="welcome-line-2"><b>LogIn</b></div>
                                        </div>
                                        <div className="input-area">
                                        {errorMessage.length > 0 &&
                                            (<div className="alert alert-danger" role="alert">
                                                {errorMessage.map((message, index) => (<div key={index}>{message}</div>))}
                                            </div>)
                                        }
                                        <div className="form-inp">
                                            <input  onChange={onChange} placeholder="이메일" type="email" id='email' name='email'/>
                                        </div>
                                        <div className="form-inp">
                                            <input onChange={onChange} type='password'  placeholder="비밀번호" id='password' name='password' />
                                        </div>
                                        </div>
                                        <div className="submit-button-cvr">
                                            <button className="submit-button" type="submit">Login</button>
                                        </div>

                                        <div className="content__or-text">
                                            <span></span>
                                            <span> or </span>
                                            <span></span>
                                        </div>

                                        <div className='forgot-pass'>
                                            <button><Link to="/signup"> <span >Don't have an account?</span> <button className='signUp-button'>SignUp</button></Link></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="content__forgot-buttons">
                            <button>
                                {/* <GoogleOAuthProvider clientId={clientId}>
                                    <GoogleLogin
                                        onSuccess={async (response) => {
                                            console.log("구글 로그인 성공", response);
                                            setIsLogin(true);
                                            const token = response.credential;
                                            console.log(jwtDecode(token))
                                            window.localStorage.setItem("email", jwtDecode(token).email);
                                            window.localStorage.setItem('isLogin', true);
                                            window.localStorage.setItem("token", token);
                                            openSignUp();
                                        }}
                                        onFailure={(error) => {
                                            console.log("구글 로그인 실패", error);
                                        }}
                                    />
                                </GoogleOAuthProvider> */}
                            </button>
                            {/* <div className="content__forgot-buttons">
                                <button><Link to="/signup"> <span>Don't have an account? Sign up</span> </Link></button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </PC>

            <Mobile>
            <div className='container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className='content'>
                        <div>
                            <div id="form-ui">
                                <form className='form' onSubmit={onSubmit}>
                                    <div className="form-body">
                                        <div className="welcome-lines">
                                            <div className="welcome-line-1">BeatBuddy</div>
                                            <div className="welcome-line-2">Login</div>
                                        </div>
                                        <div className="input-area">
                                        {errorMessage.length > 0 &&
                                            (<div className="alert alert-danger" role="alert">
                                                {errorMessage.map((message, index) => (<div key={index}>{message}</div>))}
                                            </div>)
                                        }
                                        <div className="form-inp">
                                            <input  onChange={onChange} placeholder="Email Address" type="email" id='email' name='email'/>
                                        </div>
                                        <div className="form-inp">
                                            <input onChange={onChange} type='password'  placeholder="Password" id='password' name='password' />
                                        </div>
                                        </div>
                                        <div className="submit-button-cvr">
                                        <button className="submit-button" type="submit">Login</button>
                                        </div>

                                        <div className="content__or-text">
                                            <span></span>
                                            <span> or </span>
                                            <span></span>
                                        </div>

                                        <div className='forgot-pass'>
                                            <button><Link to="/signup"> <span >Don't have an account?</span> <button className='signUp-button'>SignUp</button></Link></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="content__forgot-buttons">
                            <button>
                                {/* <GoogleOAuthProvider clientId={clientId}>
                                    <GoogleLogin
                                        onSuccess={async (response) => {
                                            console.log("구글 로그인 성공", response);
                                            setIsLogin(true);
                                            const token = response.credential;
                                            console.log(jwtDecode(token))
                                            window.localStorage.setItem("email", jwtDecode(token).email);
                                            window.localStorage.setItem('isLogin', true);
                                            window.localStorage.setItem("token", token);
                                            openSignUp();
                                        }}
                                        onFailure={(error) => {
                                            console.log("구글 로그인 실패", error);
                                        }}
                                    />
                                </GoogleOAuthProvider> */}
                            </button>
                            {/* <div className="content__forgot-buttons">
                                <button><Link to="/signup"> <span>Don't have an account? Sign up</span> </Link></button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Mobile>
        </div>
    );
}

export default Login;