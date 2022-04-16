import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const options = {
    method: 'GET',
	  headers: {
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      'X-RapidAPI-Key': "984aca7ac0msh4d28e1d4521da3dp18f560jsn6b5ba17736a5"
	  }
  };

  const options2 = {
    method: 'GET',
	  headers: {
      'X-RapidAPI-Host': 'nba-player-individual-stats.p.rapidapi.com',
      'X-RapidAPI-Key': 'c4adc611f4mshc06c0301b29d24dp14ba88jsn84008b554399'
    }
  };

 useEffect(() => { 
  const interval = setInterval(() => {
  const fetchData = async () => {
    const promiseData = await Promise.all([
      fetch("https://api-nba-v1.p.rapidapi.com/games/live/", options),
      fetch('https://nba-player-individual-stats.p.rapidapi.com/players', options2)
      ]);
    const json = await Promise.all(promiseData.map(response => response.json()));
    const jsonFilter = json[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR");
    const Data2 = await 
    fetch(`https://api-nba-v1.p.rapidapi.com/gameDetails/${jsonFilter.length !== 0? jsonFilter[0].gameId: null}`, options);
    const json2 = await Data2.json();
    const copy = [...json];
    copy.push(json2);
    setData(copy);
  };
  fetchData()
    .catch(error => {
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, 15000);
  return () => clearInterval(interval);
},[]);

console.log(data);

if (loading) return <p id="loading">Loading...Please Wait </p>;
if (error) return "error";

const filter = data[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR");
const statsFilter = data[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR").length !== 0? data[2].api.game[0].hTeam: null;
const statsFilterOpp = data[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR").length !== 0? data[2].api.game[0].vTeam: null;

const rapsPoints = statsFilter !== null? statsFilter.shortName === "TOR"? data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("points")): data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("points")): null;
const rapsPointsParsed = rapsPoints !== null? rapsPoints.map(item => parseInt(item.points)): null;
const rapsPointsLeader = rapsPointsParsed !== null? Math.max(...rapsPointsParsed): null;
const rapsRebounds = statsFilter !== null? statsFilter.shortName === "TOR"? data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("rebounds")): data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("rebounds")): null;
const rapsReboundsParsed = rapsRebounds !== null? rapsRebounds.map(item => parseInt(item.rebounds)):null;
const rapsReboundsLeader = rapsReboundsParsed !== null? Math.max(...rapsReboundsParsed): null;
const rapsAssists = statsFilter !== null? statsFilter.shortName === "TOR"? data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("assists")): data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("assists")): null;
const rapsAssistsParsed = rapsAssists !== null? rapsAssists.map(item => parseInt(item.assists)): null;
const rapsAssistsLeader = rapsAssistsParsed !== null? Math.max(...rapsAssistsParsed): null;

const oppPoints = statsFilterOpp !== null? statsFilterOpp.shortName !== "TOR"? data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("points")): data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("points")): null;
const oppPointsParsed = oppPoints !== null? oppPoints.map(item => parseInt(item.points)): null;
const oppPointsLeader = oppPointsParsed !== null?  Math.max(...oppPointsParsed): null;
const oppRebounds = statsFilterOpp !== null? statsFilterOpp.shortName !== "TOR"? data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("rebounds")): data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("rebounds")): null ;
const oppReboundsParsed = oppRebounds !== null? oppRebounds.map(item => parseInt(item.rebounds)): null;
const oppReboundsLeader = oppReboundsParsed !== null?  Math.max(...oppReboundsParsed): null;
const oppAssists = statsFilterOpp !== null? statsFilterOpp.shortName !== "TOR"? data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("assists")): data[2].api.game[0].hTeam.leaders.filter(item => item.hasOwnProperty("assists")): null;
const oppAssistsParsed = oppAssists !== null? oppAssists.map(item => parseInt(item.assists)): null;
const oppAssistsLeader = oppAssistsParsed !== null?  Math.max(...oppAssistsParsed): null;

const rapsPointsName = rapsPoints !== null? rapsPoints.filter(item => item.points == rapsPointsLeader).map(item => item.name): null;
const rapsPointsSplitFN = rapsPoints !== null? rapsPointsName[0].split(" ")[0]: null;
const rapsPointsSplitLN = rapsPoints !== null? rapsPointsName[0].split(" ")[1]: null;
const rapsReboundsName = rapsRebounds !== null? rapsRebounds.filter(item => item.rebounds == rapsReboundsLeader).map(item => item.name): null;
const rapsReboundsSplitFN = rapsRebounds !== null? rapsReboundsName[0].split(" ")[0]: null;
const rapsReboundsSplitLN = rapsRebounds !== null? rapsReboundsName[0].split(" ")[1]: null;
const rapsAssistsName = rapsAssists !== null? rapsAssists.filter(item => item.assists == rapsAssistsLeader).map(item => item.name): null;
const rapsAssistsSplitFN = rapsAssists !== null? rapsAssistsName[0].split(" ")[0]: null;
const rapsAssistsSplitLN = rapsAssists !== null? rapsAssistsName[0].split(" ")[1]: null;

const oppPointsName = oppPoints !== null? oppPoints.filter(item => item.points == oppPointsLeader).map(item => item.name):null;
const oppPointsSplitFN = oppPoints !== null? oppPointsName[0].split(" ")[0]: null;
const oppPointsSplitLN = oppPoints !== null? oppPointsName[0].split(" ")[1]: null;
const oppReboundsName = oppRebounds !== null? oppRebounds.filter(item => item.rebounds == oppReboundsLeader).map(item => item.name):null;
const oppReboundsSplitFN = oppRebounds !== null? oppReboundsName[0].split(" ")[0]: null;
const oppReboundsSplitLN = oppRebounds !== null? oppReboundsName[0].split(" ")[1]: null;
const oppAssistsName = oppAssists !== null? oppAssists.filter(item => item.assists == oppAssistsLeader).map(item => item.name):null;
const oppAssistsSplitFN = oppAssists !== null? oppAssistsName[0].split(" ")[0]: null;
const oppAssistsSplitLN = oppAssists !== null? oppAssistsName[0].split(" ")[1]: null;

  return (
    <div className="Main-container">
      <h1>Raptors Live Boxscore</h1>
      <div className="test">
        <p className="Name">Toronto Raptors</p>
        <div className="Record-div">
          <div className="Raptors-logo">
            <img id="Raptors-logo" src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Toronto_Raptors_logo.svg/300px-Toronto_Raptors_logo.svg.png" alt="raptors logo"/>
          </div>
          <p id="record">48-34</p>
        </div>
        <p className="Score">{filter.length !== 0? filter.map(item => item.hTeam.shortName === "TOR"? item.hTeam.score.points : item.vTeam.score.points): "---"}</p>
        <div className="Middle-Div">
          <p className="VS">--</p>
          <p className="Time">{filter.length !== 0? filter.map(item => item.currentPeriod === "1/4"? <span><span className="Q">Q </span>1 - {item.clock}</span>: item.currentPeriod === "2/4"? <span><span className="Q">Q </span>2 - {item.clock}</span> : item.currentPeriod === "3/4"? <span><span className="Q">Q </span>3 - {item.clock}</span>: <span><span className="Q">Q </span>4 - {item.clock}</span>) : "--" }</p>
        </div>
        <p className="Score2">{filter.length !== 0? filter.map(item => item.hTeam.shortName === "TOR"? item.vTeam.score.points : item.hTeam.score.points): "---"}</p>
        <div className="Record-div">
          <div className="Raptors-logo">
          <img id="logo" src={filter.length !== 0? filter.map(item => item.hTeam.shortName === "TOR"? item.vTeam.logo: item.hTeam.logo): "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png"} alt="Opponent logo"/>
          </div>
          <p id="record">51-31</p>
        </div>
        <p className="Name2"> {filter.length !== 0? filter.map(item => item.hTeam.shortName === "TOR"? item.vTeam.fullName : item.hTeam.fullName): "N/A"}</p>
      </div>
    <div className="Leaders">
      <div className="Leaders2">
        <p id="Stats-Leader">Stats Leaders</p>
        <div className="Leaders3">
          <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == rapsPointsSplitFN && item.lastName.includes(rapsPointsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
          <p className="Player-Name">{filter.length !== 0? rapsPoints.filter(item => item.points == rapsPointsLeader).map(item => item.name)[0]: ""}</p>
          <p className="points">{filter.length !== 0? rapsPoints.filter(item => item.points == rapsPointsLeader).map(item => item.points)[0]: ""}</p>
          <p className="stats">PTS</p>
        </div>
        <div className="Leaders3">
          <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == rapsReboundsSplitFN && item.lastName.includes(rapsReboundsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
          <p className="Player-Name">{filter.length !== 0? rapsRebounds.filter(item => item.rebounds == rapsReboundsLeader).map(item => item.name)[0]: ""}	</p>
          <p className="points">{filter.length !== 0? rapsRebounds.filter(item => item.rebounds == rapsReboundsLeader).map(item => item.rebounds)[0]: ""}</p>
          <p className="stats">REB</p>
        </div>
        <div className="Leaders3">
          <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == rapsAssistsSplitFN && item.lastName.includes(rapsAssistsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
          <p className="Player-Name">{filter.length !== 0? rapsAssists.filter(item => item.assists == rapsAssistsLeader).map(item => item.name)[0]: ""}</p>
          <p className="points">{filter.length !== 0? rapsAssists.filter(item => item.assists == rapsAssistsLeader).map(item => item.assists)[0]: ""}</p>
          <p className="stats">AST</p>
        </div>
      </div>
      <div id="Line"></div>
      <div className="Leaders2">
        <p id="Stats-Leader">Stats Leaders</p>
        <div className="Leaders3">
          <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == oppPointsSplitFN && item.lastName.includes(oppPointsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
          <p className="Player-Name">{filter.length !== 0? oppPoints.filter(item => item.points == oppPointsLeader).map(item => item.name)[0]: ""}</p>
          <p className="points">{filter.length !== 0? oppPoints.filter(item => item.points == oppPointsLeader).map(item => item.points)[0]: ""}</p>
          <p className="stats">PTS</p>
        </div>
          <div className="Leaders3">
            <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == oppReboundsSplitFN && item.lastName.includes(oppReboundsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
            <p className="Player-Name">{filter.length !== 0? oppRebounds.filter(item => item.rebounds == oppReboundsLeader).map(item => item.name)[0]:""}</p>
            <p className="points">{filter.length !== 0? oppRebounds.filter(item => item.rebounds == oppReboundsLeader).map(item => item.rebounds)[0]:""}</p>
            <p className="stats">REB</p>
          </div>
          <div className="Leaders3">
            <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == oppAssistsSplitFN && item.lastName.includes(oppAssistsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
            <p className="Player-Name">{filter.length !== 0? oppAssists.filter(item => item.assists == oppAssistsLeader).map(item => item.name)[0]:""}</p>
            <p className="points">{filter.length !== 0? oppAssists.filter(item => item.assists == oppAssistsLeader).map(item => item.assists)[0]:""}</p>
            <p className="stats">AST</p>
          </div>
          <p style={{fontSize:12, marginLeft: 70,  width: 200, paddingLeft: 110, fontFamily: "monospace"}}>Coded By - Sunny Gian</p>
      </div>
    </div>
  </div>  
  );
}

export default App;

