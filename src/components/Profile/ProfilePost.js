import React, { useEffect, useState } from 'react';
import { PC, Mobile } from '../Responsive';
import FeedDetail from '../Modal/Feed/FeedDetail';
import axios from 'axios';
import Loading from '../Loading';

function ProfilePost() {
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [isFeedDetailOpen, setIsFeedDetailOpen] = useState(false);
    const [feedData, setFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const openFeedDetail = (music) => {
        setSelectedMusic(music);
        setIsFeedDetailOpen(true);
    }

    useEffect(() => {
        setIsLoading(true); // API 호출 전에 true로 설정하여 로딩화면 띄우기

        axios.get(`https://94ed-121-190-220-40.ngrok-free.app/api/feeds`, {
            headers: {
                'Content-Type': `application/json`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
            .then((response) => {
                console.log("서버에서 받아온 결과", response.data);
                const temp = response.data;
                setFeedData(temp);
                setIsLoading(false); // API 호출이 완료되면 false로 변경하여 로딩화면 숨김처리
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }, [])

    return (
        <div>
            <PC>
                <div className='row'>
                    {isLoading ? <Loading /> : null}
                    {feedData ? (
                        feedData.slice().reverse().map((music) => (
                            <div className='col-md-4' key={music.id} onClick={() => openFeedDetail(music)} style={{ cursor: 'pointer' }}>
                                <div className='card-header'>
                                    <img className='' style={{ width: '150px', height: '150px' }} src={music.imageFileUrl || music.musicInfoList[0].albumUrl}
                                        alt={`Album cover for ${music.musicInfoList[0].musicTitle}`}>
                                    </img>
                                </div>
                                <div className='card-body mt-2'>
                                    <b>{music.musicInfoList[0].musicTitle}</b>
                                    <div>
                                        <b>{music.musicInfoList[0].musicArtist}</b>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'gray' }}>{music.musicInfoList[0].albumName} · {music.musicInfoList[0].releaseDate}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>게시글이 없습니다.</p>
                    )}
                </div>

                {isFeedDetailOpen && (
                    <FeedDetail
                        open={isFeedDetailOpen}
                        onClose={() => {
                            setIsFeedDetailOpen(false);
                        }}
                        music={selectedMusic}
                    />
                )}
            </PC>

            <Mobile>
                <div className='row'>
                    {isLoading ? <Loading /> : null}
                    {feedData ? (
                        feedData.slice().reverse().map((music) => (
                            <div className='col-4' key={music.id} onClick={() => openFeedDetail(music)} style={{ cursor: 'pointer' }}>
                                <div className='card-header'>
                                    <img className='' style={{ width: '110px', height: '110px' }} src={music.imageFileUrl || music.musicInfoList[0].albumUrl}
                                        alt={`Album cover for ${music.musicInfoList[0].musicTitle}`}>
                                    </img>
                                </div>
                                <div className='card-body mt-2'>
                                    <b>{music.musicInfoList[0].musicTitle}</b>
                                    <div>
                                        <b>{music.musicInfoList[0].musicArtist}</b>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'gray' }}>{music.musicInfoList[0].albumName} · {music.musicInfoList[0].releaseDate}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>게시글이 없습니다.</p>
                    )}
                </div>

                {isFeedDetailOpen && (
                    <FeedDetail
                        open={isFeedDetailOpen}
                        onClose={() => {
                            setIsFeedDetailOpen(false);
                        }}
                        music={selectedMusic}
                    />
                )}
            </Mobile>
        </div>
    );
}

export default ProfilePost;