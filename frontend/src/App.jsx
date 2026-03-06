import { useState } from "react";

function App() {

  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const detectMood = async () => {

    if (!text.trim()) return;

    setLoading(true);

    try {

      const response = await fetch("https://youtube-recommondations.onrender.com/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      setMood(data.mood);
      setVideos(data.videos);

    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{textAlign:"center", padding:"40px"}}>

      <h1>Mood reseter</h1>

      <input
        type="text"
        placeholder="Tell me how you feel..."
        value={text}
        onChange={(e)=>setText(e.target.value)}
        style={{padding:"10px", width:"300px"}}
      />

      <button
        onClick={detectMood}
        style={{padding:"10px", marginLeft:"10px"}}
      >
        Get Music
      </button>

      {loading && <p>Finding songs for your mood...</p>}

      {mood && !loading && (
        <h2>Your Mood: {mood}</h2>
      )}

      <div style={{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        gap:"20px",
        marginTop:"30px"
      }}>

        {videos.map((video) => (
          <div key={video.videoId}>
            <iframe
              width="350"
              height="200"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              allowFullScreen
            />
            <p>{video.title}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default App;
