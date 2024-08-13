import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navigation/Navbar";
import { PC,Mobile } from "../Responsive";
import '../../style/css/Home.css';
import axios from 'axios';
import Loading from "../Loading";
import MiniPlayer from "../Player/MiniPlayer";



function PlaylistByLikes(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [ likedPLData, setLikedPLData ] = useState([]);

    useEffect(()=>{
        setIsLoading(true);

        axios.get(`http://localhost:8080/api/playlist/orderedByLikeCount`, {
            headers:{
                'Content-Type': `application/json`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
        .then((response) => {
            console.log(response.data);
            setLikedPLData(response.data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('API 요청 중 오류 발생', error);
        });
    },[])

    const openPlaylistDetail = (playlist) => {
        navigate(`/playlistDetail/${playlist.nickName}/${playlist.id}`);
    }
    const goPlaylist = ()=>{
        navigate('/playlist');
    }
    return(
        <div>
            <PC>
                <div className="row">
                    <div className="col-md-2"> <Navbar /> </div>

                    <div className="col-md-8">
                        <div className="mt-5" style={{ maxHeight:"100vh", overflow: "scroll"}}>
                            <div>
                                <button style={{ color:'white'}} onClick={goPlaylist}>최신순</button>
                                <button style={{color:'white'}}> 좋아요순</button>
                            </div>
                            {isLoading ? <Loading /> : null}
                            
                            <div className="row ms-5 me-5">
                                {likedPLData && likedPLData.map((playlist) => (
                                    <div className="col-md-3" key={playlist.id}>
                                        <div className="card mb-2" style={{ height:"auto", backgroundColor: "#242424", color: "white"}}>
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
                    <div className="col-md-2">
                        <MiniPlayer/>
                    </div>
                </div>
            </PC>
            <Mobile></Mobile>
        </div>    

    );
}

export default PlaylistByLikes;