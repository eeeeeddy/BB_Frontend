import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PC, Mobile } from "../Responsive";
import Navbar from '../../components/Navigation/Navbar';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MiniPlayer from '../../components/Player/MiniPlayer';
import FeedDetail from "../Modal/Feed/FeedDetail";
import '../../style/css/Search.css';

function SearchByFeed({ searchText: initialSearchText, filter }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState(initialSearchText || '');
    const [feedResult, setFeedResult] = useState([]);
    const [selectedButton, setSelectedButton] = useState('feed');
    const [isFeedDetailOpen, setIsFeedDetailOpen] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState(null);

    useEffect(() => {
        // location에서 searchText와 filter 값을 추출하여 state 업데이트
        const { searchText } = location.state || {};
        setSearchText(typeof searchText === 'string' ? searchText.trim() : '');
    }, [location]);

    useEffect(() => {
        const SearchFeed = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/search/feed/Keyword', {
                    params: {
                        keyword: searchText,
                    },
                    headers: {
                        'ngrok-skip-browser-warning': '69420'
                    }
                });
                console.log("피드검색", res.data)
                setFeedResult(res.data);
            } catch (error) {
                console.error("검색 중 오류 발생", error);
            }
        };
        if (searchText.trim() !== '') {
            SearchFeed();
        } else {
            setFeedResult([]);
        }
    }, [searchText]);

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    // FIXME:feedDetail이랑 연결안됨
    const openFeedDetail = (music)=>{
        // setIsFeedDetailOpen(true);
        // setSelectedMusic(result);
        if (music && music.musicInfoList?.length > 0) {
            setIsFeedDetailOpen(true);
            setSelectedMusic(music);
            console.log('이거누름', setSelectedMusic);
        }
    }

    const goSearchByAll = (searchText) => {
        navigate('/search', { state: { searchText, filter } })
        setSelectedButton('all');
    };
    const goSearchByFeed = (searchText) => {
        navigate('/search/feed', { state: { searchText, filter } })

    };

    const goSearchByPlaylist = (searchText) => {
        navigate('/search/playlist', { state: { searchText, filter } })

    };

    const goSearchByTag = (searchText) => {
        navigate('/search/tag', { state: { searchText, filter } })

    };



    return (
        <div>
            <PC>
                <div className="row">
                    <div className="col-md-2">
                        <Navbar />
                    </div>

                    <div className="col-md-8">
                        <div className='search-input d-flex' style={{ marginTop: '30px', marginBottom: '30px' }}>
                            <input className="textInput me-2" type="text" placeholder="Search" value={searchText} onChange={handleInputChange} />
                        </div>
                        <div className='filter-buttons'>
                            <button className={`filterbtn ${selectedButton === 'all' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByAll(searchText)}>모두</button>
                            <button className={`filterbtn ${selectedButton === 'feed' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByFeed(searchText)}>게시글</button>
                            <button className={`filterbtn ${selectedButton === 'playlist' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByPlaylist(searchText)}>플레이리스트</button>
                            <button className={`filterbtn ${selectedButton === 'tag' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByTag(searchText)}>태그</button>
                        </div>

                        <div className="Playlist-result mt-5">
                            <div className="result-container">
                                <div className="row">
                                    {feedResult.slice().map((result) => (
                                        <div className="col-md-3" key={result.id}  onClick={() => openFeedDetail(result)} style={{ cursor: 'pointer' }}>
                                            <div className="card mb-2" style={{ backgroundColor: "#242424", color: "white" }}>
                                                <div className="card-body">
                                                    <div>
                                                        {result.img_src !== null ? (
                                                            <img className="mb-3" src={result.img_src} alt={result.title} style={{ width: '150px', height: '150px' }} />
                                                        ) : (
                                                            <img className="mb-3" src={result.album_url} alt={result.album_name} style={{ width: '150px', height: 'auto' }} />
                                                        )}
                                                    </div>
                                                    <div className="UserInfo">
                                                        <p><img className="" src={result.user_img_src} alt={result.nick_name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', backgroundColor: 'white' }} />{result.nick_name}</p>
                                                    </div>
                                                    <p style={{ backgroundColor: '#fedc00ff', color: 'black', width: '50px', borderRadius: '30px', fontSize: '12px' }}>{result.tag_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <MiniPlayer />
                    </div>
                </div>

                {isFeedDetailOpen && (
                    <FeedDetail
                        open={isFeedDetailOpen}
                        music={selectedMusic}
                        // isNoteClicked={isNoteClicked}
                        // isBookmarked={isBookmarked}
                        onClose={() => {
                            setIsFeedDetailOpen(false);
                        }}
                        
                    />
                )}
            </PC>
            <Mobile></Mobile>
        </div>
    );
}

export default SearchByFeed;