import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { Mobile, PC } from '../components/Responsive';
import { useLocation, useNavigate } from "react-router-dom";
import SearchByFeed from '../components/Search/SearchByFeed';
import SearchByPlaylist from '../components/Search/SearchByPlaylist';
import SearchByTag from '../components/Search/SearchByTag';
import axios from 'axios';
import MiniPlayer from '../components/Player/MiniPlayer';
import '../style/css/Search.css';

//TODO:feedDetail 모달 열리도록
function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState(''); //검색
    const [searchResult, setSearchResult] = useState([]); //검색결과
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [recentSearches, setRecentSearches] = useState([]);  //최근검색기록
    const [filter, setFilter] = useState("all");
    const [selectedButton, setSelectedButton] = useState('all');

    useEffect(() => {
        const { searchText } = location.state || {};
        setSearchText(typeof searchText === 'string' ? searchText.trim() : '');
    }, [location]);

    const fetchUserDetails = async (nick_name) => {
        try {
            const res= await axios.get('http://localhost:8080/api/search/users/nickname',{
                params:{
                    nickname: nick_name,
                },
                headers:{
                    'ngrok-skip-browser-warning': '69420' 
                }
            });
            console.log("유저정보", res.data);
            setUserDetails(res.data);
        } catch (error) {
            console.error("유저 정보 오류 발생", error);
        }
    };
    
    
    useEffect(()=>{
        const SearchData = async ()=>{
            if (!searchText.trim()) {
                setSearchResult([]);
                return;
            }
            try{
                const res = await axios.get('http://localhost:8080/api/search/total/Keyword',{
                    params: {
                        keyword: searchText,
                    },
                    headers:{
                        'ngrok-skip-browser-warning': '69420' 
                    }
                });
                setSearchResult(res.data);
                console.log(res.data);
                
                const userResult = res.data.find(result => result.nick_name === searchText);
                if (userResult && userResult.nick_name) {
                    fetchUserDetails(userResult.nick_name);
                } else {
                    setUserDetails(null);
                }
            } catch(error){
                console.error("검색 중 오류 발생", error);
            }
        };
        if (searchText.trim() !== '') {
            SearchData();
        } else {
            // searchText 값이 없을 때 빈 배열로 설정
            setSearchResult([]);
        }

    }, [searchText]);

    const filteredResult = () => {
        let results = [];

        if (filter === 'all') {
            results = searchResult;
        } else if (filter === 'post') {
            results = searchResult.filter(result => result.article_type === 'FEED_TYPE').slice(0, 5);
        } else if (filter === 'playlist') {
            results = searchResult.filter(result => result.article_type === 'PLAYLIST_TYPE').slice(0, 5);
        } else if (filter === 'user') {
            results = userDetails;
        } else  {
            results = [];
        }

        return results;
    };


    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };
    // const handleSearch = () => {
    //     setSearchText(searchText);
    // }; 

    
    const goSearchByFeed = () => {
        navigate('/search/feed', { state: { searchText, filter } });
        setSelectedButton('feed');
    };
    
    const goSearchByPlaylist = () => {
        navigate('/search/playlist', { state: { searchText, filter } });
        setSelectedButton('playlist');
    };

    const goSearchByTag = (searchText) =>{
        navigate('/search/tag', { state: { searchText, filter } })
        setSelectedButton('tag');
    };


    return (
        <div>
            <PC>
                <div className='row'>
                    <div className='col-md-2'>
                        <Navbar/>
                    </div>

                    <div className='col-md-8'>
                        <div className='search-input d-flex' style={{ marginTop: '30px', marginBottom: '30px' }}>
                            <input class="textInput me-2" type="text" placeholder="Search" value={searchText} onChange={handleInputChange} />
                        </div>
                        <div className='filter-buttons'>
                            <button className={`filterbtn ${selectedButton === 'all' ? 'selected' : ''}`} style={{color:'white'}} >모두</button>
                            <button className={`filterbtn ${selectedButton === 'feed' ? 'selected' : ''}`} style={{color:'white'}} onClick={() => goSearchByFeed({ searchText })}>게시글</button>
                            <button className={`filterbtn ${selectedButton === 'playlist' ? 'selected' : ''}`} style={{color:'white'}} onClick={() => goSearchByPlaylist({ searchText })}>플레이리스트</button>
                            <button className={`filterbtn ${selectedButton === 'tag' ? 'selected' : ''}`} style={{color:'white'}} onClick={() => goSearchByTag({ searchText })} >태그</button>
                        </div>

                        <div className='result-container'>
                            {filter === 'all' && (
                                <>
                                <div>
                                    <div className='users-container'>
                                        <h3>사용자</h3>
                                        {userDetails?.map((user, index) => (
                                            <div key={index}>
                                                <p><img src={user.user_img_src} alt={user.nick_name} style={{width: '30px', height: '30px',borderRadius:'50%', marginRight:'10px', backgroundColor:'white'  }} />
                                                {` ${user.nick_name}`}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />

                                    <div className='posts-container'>
                                        <h3>게시글</h3>
                                        <div className='row'>
                                            {filteredResult().map((result) => {
                                                if(result.article_type === "FEED_TYPE"){
                                                    return(
                                                        <div className="col-md-3" key={result.id}>
                                                            <div className="card mb-2"  style={{backgroundColor: "#242424", color: "white"}}>

                                                                <div className="card-body"  style={{backgroundColor: "#242424", color: "white"}}>
                                                                    <div>
                                                                        {result.img_src !== null ? (
                                                                            <img
                                                                                className="mb-3"
                                                                                src={result.img_src}
                                                                                alt={result.album_name}
                                                                                style={{ width: '150px', height: 'auto' }}
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                className="mb-3"
                                                                                src={result.f_album_url}
                                                                                alt={result.album_name}
                                                                                style={{ width: '150px', height: 'auto' }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="musicInfo">
                                                                        <p>{result.f_music_title}</p>
                                                                        <p>{result.music_artist}</p>
                                                                    </div>
                                                                    <div className="UserInfo">
                                                                        <p><img className="" src={result.user_img_src} alt={result.nick_name} style={{width: '30px', height: '30px',borderRadius:'50%', marginRight:'10px'  }}/>{result.nick_name}</p>
                                                                    </div>  
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                    <hr />

                                    <div className='playlists-container'>
                                        <h3>플레이리스트</h3>
                                        <div className='row'>
                                            {filteredResult().map((result) => {
                                                if (result.article_type === "PLAYLIST_TYPE") {
                                                    return (
                                                    <div className="col-md-3" key={result.id}>
                                                        <div className="card mb-2" style={{backgroundColor: "#242424", color: "white"}}>
                                                            <div className="card-body">
                                                                <div>
                                                                    <img className="mb-3" src={result.img_src} alt={result.title} style={{ width: '150px', height: 'auto' }} />
                                                                </div>
                                                                <p>{result.title}</p>
                                                                <div className="UserInfo">
                                                                    <p><img className="" src={result.user_img_src} alt={result.nick_name} style={{width: '30px', height: '30px',borderRadius:'50%', marginRight:'10px'  }}/>{result.nick_name}</p>
                                                                </div>  
                                                                <p style={{backgroundColor:'#fedc00ff', color:'black', width:'50px', borderRadius:'30px', fontSize:'12px'}}>{result.tag_name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    );
                                                }
                                                return null; 
                                            })}
                                        </div>
                                    </div>
                                    <hr />

                                    {/* <div className='tags-container'>
                                        <h3>태그</h3>
                                        <div className='tags'>
                                            <ul>
                                                {filteredResult
                                                    .filter(result => result.type === 'tags')
                                                    .map((result, index) => (
                                                        <li key={index}>{result.title}</li>
                                                    ))}
                                            </ul>   
                                        </div>
                                        
                                    </div> */}
                                </div>
                                </>
                            )}
                            {filter !== 'all' && (
                                <div>
                                    <ul>
                                        {filteredResult.map((result, index) => (
                                            <li key={index}>{result.title}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            </div>
                        </div>

                    <div className='col-md-2'>
                        <MiniPlayer/>
                    </div>

                </div>
            </PC>

            {/* <Mobile>
                <div>
                    <Navbar />
                    <div className='search-input d-flex' style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <input class="form-control me-2" type="text" placeholder="Search" value={searchText} onChange={handleInputChange} />
                        <button class="btn btn-outline-success" onClick={handleSearch}>Search</button>
                    </div>
                    <div>
                        <SearchResult searchText={searchText} searchResult={searchResult} />
                    </div>
                </div>
            </Mobile> */}
        </div>
    );
}

export default Search;