import React, { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import { PC, Mobile } from "../Responsive";
import Navbar from '../../components/Navigation/Navbar';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MiniPlayer from '../../components/Player/MiniPlayer';
import '../../style/css/Search.css';

function SearchByPlaylist ({searchText: initialSearchText, filter}){
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState(initialSearchText || '');
    const [playlistResult, setPlaylistResult] = useState([]);
    const [selectedButton, setSelectedButton] = useState('playlist');

    useEffect(() => {
        // location에서 searchText와 filter 값을 추출하여 state 업데이트
        const { searchText } = location.state || {};
        setSearchText(typeof searchText === 'string' ? searchText.trim() : '');
    }, [location]);


    const handleInputChange = (e) => {
        // setPlSearch(e.target.value);
        setSearchText(e.target.value);
    };

    useEffect(() => {
        const SearchPlaylist = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/search/playlist/Keyword', {
                    params: {
                        keyword: searchText,
                    },
                    headers: {
                        'ngrok-skip-browser-warning': '69420'
                    }
                });
                setPlaylistResult(res.data);
            } catch (error) {
                console.error("검색 중 오류 발생", error);
            }
        };

        if (searchText.trim() !== '') {
            SearchPlaylist();
        } else {
            setPlaylistResult([]);
        }
    }, [searchText]);

    const goSearchByAll = (searchText) => {
        navigate('/search', { state: { searchText, filter } })
        setSelectedButton('all');
    };
    const goSearchByFeed = (searchText) => {
        navigate('/search/feed', { state: { searchText, filter } })
        setSelectedButton('feed');
    };

    const goSearchByPlaylist = (searchText) => {
        navigate('/search/playlist', { state: { searchText, filter } })
        setSelectedButton('playlist');
    };

    const goSearchByTag = (searchText) => {
        navigate('/search/tag', { state: { searchText, filter } })
        setSelectedButton('tag');
    };

    return(
        <div>
            <PC>
                <div className="row">
                    <div className="col-md-2">
                        <Navbar/>
                    </div>

                    <div className="col-md-8">
                        <div className='search-input d-flex' style={{ marginTop: '30px', marginBottom: '30px' }}>
                            <input class="textInput me-2" type="text" placeholder="Search" value={searchText} onChange={handleInputChange} />
                        </div>
                        <div className='filter-buttons' >
                            <button className={`filterbtn ${selectedButton === 'all' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByAll(searchText)}>모두</button>
                            <button className={`filterbtn ${selectedButton === 'feed' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByFeed(searchText)}>게시글</button>
                            <button className={`filterbtn ${selectedButton === 'playlist' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByPlaylist(searchText)}>플레이리스트</button>
                            <button className={`filterbtn ${selectedButton === 'tag' ? 'selected' : ''}`} style={{ color: 'white' }} onClick={() => goSearchByTag(searchText)}>태그</button>
                        </div>


                        <div className="Playlist-result mt-5">
                            <h3> 플레이리스트 </h3>
                                <hr />
                            <div className="result-container">
                                <div className="row">
                                    {playlistResult.slice().map((result) => (
                                        <div className="col-md-3" key={result.playlist_id}  >
                                            <div className="card mb-2" style={{ backgroundColor: "#242424", color: "white" }}>
                                                <div className="card-body">
                                                    <div>
                                                        <img className="mb-3" src={result.img_src} alt={result.title} style={{ width: '150px', height: 'auto' }} />
                                                    </div>
                                                    <p>{result.title}</p>
                                                    <div className="UserInfo">
                                                        <p><img className="" src={result.user_img_src} alt={result.nick_name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />{result.nick_name}</p>
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
                        <MiniPlayer/>
                    </div>
                </div>
                
            </PC>
            <Mobile></Mobile>
        </div>
    );
}

export default SearchByPlaylist;