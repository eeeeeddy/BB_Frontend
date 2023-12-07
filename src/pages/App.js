import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Alarm from './Alarm';
import DM from './DM';
import Search from './Search';
import Profile from './Profile';
import CreatePost from '../Modal/Post/CreatePost';
import MusicSearch from '../Modal/Post/MusicSearch';
import FeedPicChoose from '../Modal/Post/FeedPicChoose';
import FeedTextInput from '../Modal/Post/FeedText';
import PlayListSearch from '../Modal/PlayList/PlayListSearch';
import PlayListPicChoose from '../Modal/PlayList/PlayListPicChoose';
import PlayListText from '../Modal/PlayList/PlayListText';
import FeedDetail from '../Modal/Feed/FeedDetail';
import Playlist from './Playlist';
import MusicPlayerTest from './MusicPlayerTest';

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/alarm" element={<Alarm />} />
                    <Route path="/dm" element={<DM />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/detail" element={<FeedDetail />} />
                    <Route path="/create" element={<CreatePost />} /> {/* Post Test Link */}
                    <Route path="/post" element={<MusicSearch />} /> {/* Post Test Link */}
                    <Route path="/post/1" element={<FeedPicChoose />} /> {/* Post Test Link */}
                    <Route path="/post/2" element={<FeedTextInput />} /> {/* Post Test Link */}
                    <Route path="/pl" element={<PlayListSearch />} /> {/* Post Test Link */}
                    <Route path="/pl/1" element={<PlayListPicChoose />} /> {/* Post Test Link */}
                    <Route path="/pl/2" element={<PlayListText />} /> {/* Post Test Link */}
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/test" element={<MusicPlayerTest />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
