import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { PC, Mobile } from "../components/Responsive";
import '../style/css/Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import MiniPlayer from '../components/Player/MiniPlayer';
import PlaylistByLikes from '../components/Playlist/PlaylistByLikes';

function Playlist() {
    const navigate = useNavigate();
    const [playlistData, setPlaylistData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // API 호출 전에 true로 설정하여 로딩화면 띄우기

        axios.get(`http://localhost:8080/api/playlist`, {
            headers: {
                'Content-Type': `application/json`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
            .then((response) => {
                console.log("서버에서 받아온 결과", response.data);
                const temp = response.data;
                setPlaylistData(temp);
                setIsLoading(false); // API 호출이 완료되면 false로 변경하여 로딩화면 숨김처리
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }, [])

    const openPlaylistDetail = (playlist) => {
        navigate(`/playlistDetail/${playlist.nickName}/${playlist.id}`);
    }
    const goPlaylistByLikes = ()=>{
        navigate(`/playlist/likes`);
    }
    return (
        <div>
            <PC>
                <div className='row'>
                    <div className='col-md-2'>
                        <Navbar />
                    </div>
                    <div className='col-md-8'>
                        <div className='mt-5' style={{ maxHeight: "100vh", overflow: "scroll" }}>
                            <div>
                                <button style={{color:'white'}}> 최신순</button>
                                <button style={{ color:'white'}} onClick={goPlaylistByLikes}>좋아요</button>
                            </div>
                            {isLoading ? <Loading /> : null}
                            <div className='row ms-5 me-5'>
                                {playlistData.slice().map((playlist) => (
                                    <div className='col-md-3' key={playlist.id}>
                                        <div className="card mb-2" style={{ height: "auto", backgroundColor: "#242424", color: "white" }}>
                                            <div className="card-body">
                                                <img style={{ width: "70%", height: "70%" }} src={playlist.imageFileUrl} alt={playlist.title}></img>
                                                <p className='mt-2'><b className='mt-3'>{playlist.title}</b></p>
                                                <p>{`${playlist.nickName}`}</p>
                                                <p>{`${playlist.musicInfoList.length} 곡`}</p>
                                                {/* <p style={{ color: '#4887E5' }}>{playlist.tagName.map((tag, index) => `#${tag} ${index < playlist.tagName.length - 1 ? ' ' : ''}`)}</p> */}
                                                <p>{playlist.content}<span style={{ color: "grey", cursor: "pointer" }} onClick={() => openPlaylistDetail(playlist)}>더보기</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-2'>
                        <MiniPlayer />
                    </div>
                </div>
            </PC>

            <Mobile>
                <Navbar />
                <h2 className='text-start ms-3 mt-3 mb-3'>BeatBuddy</h2>
                <div className='row ms-2 me-2'>
                    {isLoading ? <Loading /> : null}
                    {playlistData.slice().reverse().map((playlist) => (
                        <div className='col-4' key={playlist.id}>
                            <div className="card mb-2" style={{ height: "auto", backgroundColor: "#f2f2f2" }}>
                                <div className="card-body">
                                    <img style={{ width: "80%", height: "80%" }} src={playlist.imageFileUrl} alt={playlist.title}></img>
                                    <p className='mt-2'><b>{playlist.title}</b></p>
                                    <p className='mt-0'>{`${playlist.musicInfoList.length} 곡`}</p>
                                    {/* <p style={{ color: '#4887E5' }}>{playlist.tagName.map((tag, index) => `#${tag} ${index < playlist.tagName.length - 1 ? ' ' : ''}`)}</p> */}
                                    <p>{playlist.content}<span style={{ color: "grey", cursor: "pointer" }} onClick={() => openPlaylistDetail(playlist)}>더보기</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Mobile>
        </div>
    );
}

export default Playlist;