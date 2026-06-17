
import { useEffect, useState } from "react";

export default function App() {
  const [videos,setVideos]=useState([]);
  const [query,setQuery]=useState("programming");
  const [selected,setSelected]=useState(null);
  const [dark,setDark]=useState(localStorage.getItem("theme")!=="light");
  const [sidebar,setSidebar]=useState(true);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    localStorage.setItem("theme",dark?"dark":"light");
  },[dark]);

  async function searchVideos(q){
    setLoading(true);
    try{
      const key=import.meta.env.VITE_YOUTUBE_API_KEY;
      const res=await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=18&q=${encodeURIComponent(q)}&key=${key}`);
      const data=await res.json();
      setVideos(data.items || []);
      if(data.items?.length) setSelected(data.items[0]);
    }catch(err){ console.error(err); }
    setLoading(false);
  }

  useEffect(()=>{searchVideos("programming");},[]);

  return (
    <div className={dark ? "app dark":"app light"}>
      <header className="navbar">
        <button className="iconBtn" onClick={()=>setSidebar(!sidebar)}>☰</button>
        <h1><span>▶</span> MiniTube</h1>

        <div className="searchWrap">
          <input value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&searchVideos(query)}
            placeholder="Search videos..." />
          <button onClick={()=>searchVideos(query)}>Search</button>
        </div>

        <button className="iconBtn" onClick={()=>setDark(!dark)}>
          {dark?"☀️":"🌙"}
        </button>
      </header>

      <div className="container">
        {sidebar && (
          <aside className="sidebar">
            <button onClick={()=>searchVideos("latest videos")}>🏠 Home</button>
            <button onClick={()=>searchVideos("trending")}>🔥 Trending</button>
            <button onClick={()=>searchVideos("gaming")}>🎮 Gaming</button>
            <button onClick={()=>searchVideos("music")}>🎵 Music</button>
            <button onClick={()=>searchVideos("technology")}>💻 Tech</button>
          </aside>
        )}

        <main className="content">
          {selected && (
            <div className="playerCard">
              <iframe
                src={`https://www.youtube.com/embed/${selected.id.videoId}`}
                title="video"
                allowFullScreen
              />
              <h2>{selected.snippet.title}</h2>
              <p>{selected.snippet.channelTitle}</p>
              <div className="actions">
                <button>👍 Like</button>
                <button>👎 Dislike</button>
                <button>🔔 Subscribe</button>
              </div>
            </div>
          )}

          {loading ? <h3>Loading videos...</h3> :
          <div className="grid">
            {videos.map(v=>(
              <div className="card" key={v.id.videoId} onClick={()=>setSelected(v)}>
                <img src={v.snippet.thumbnails.medium.url} />
                <div className="info">
                  <h4>{v.snippet.title}</h4>
                  <p>{v.snippet.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>}
        </main>
      </div>
    </div>
  );
}
