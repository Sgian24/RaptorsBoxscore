# Raptors Boxscore

A boxscore I made that displays the score and statistical leaders for live Toronto Raptors games.

## Tools Used

- create-react-app

## Features

- real-time score updates for live Raptors games
- real-time leaderboard updates for each team's statisical leaders during the game
- player headshots updated alongside the statistical leaders
- fetches data from 2 different REST APIs; "API-NBA" (https://rapidapi.com/api-sports/api/api-nba) and "NBA Player INdividual Stats" (https://rapidapi.com/kaylanhusband/api/nba-player-individual-stats)   

## Challenges and Lessons Learned

This was my first attempt at using the fetch API and tinkering with JSON in general. It was challenging trying to fetch data from 2 APIs and 3 different endpoints.

  - had difficulty trying to fetch data from two different APIs; using two separate `fetch("url")` and `.json()` functions inside a `useEffect` hook did not fetch the data from the second api
    - solved by using a `promise.all` function inside an `async` function instead:
     ```
     useEffect(() => { 
      const fetchData = async () => {
        const promiseData = await Promise.all([
          fetch("https://api-nba-v1.p.rapidapi.com/games/live/", options),
          fetch("https://nba-player-individual-stats.p.rapidapi.com/players", options2)
         ]);
        const json = await Promise.all(promiseData.map(response => response.json()));
        setData(json);
      };
     fetchData()
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
     },[]);
 - in order to fetch the data for the in-game statistical leaders I had to use the "https://nba-player-individual-stats.p.rapidapi.com/gameDetails/gameId" endpoint from the "API-NBA" API; since the gameId is required, this endpoint is dependent on the data i fetched from "https://nba-player-individual-stats.p.rapidapi.com/gameDetails/gameId"
   - i had trouble figuring out how to use a third `fetch()` function separately from the `Promise.all` function ; setting the JSON data pulled from the third `fetch()` function into another state variable using `useState` did not work, I could not figure out how to render the JSON data    
     - solved by first filtering out the games in the "API-NBA" API to only include Toronto Raptors games
     ```
     const jsonFilter = json[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR");
     ```
     - I then proceeded to fetch from the gameDetails endpoint using `const jsonFilter` inside the url with a template literal
     
     ```
     const Data2 = await 
      fetch(`https://api-nba-v1.p.rapidapi.com/gameDetails/${jsonFilter.length !== 0? jsonFilter[0].gameId: null}`, options);
     const json2 = await Data2.json();
     ```
     - finally, I made a copy of `const json` and merged both the copy and `json2` using `.push()`, I then set the new state using the copy
     ```
     const copy = [...json];
     copy.push(json2);
     setData(copy);
     ```
     
  - another issue that arose was trying to figure out how to display the live score only for Raptors' games
    - solved by first doing what I did prior and filtering out the games in the "API-NBA" API to only include Raptors games
    ```
    const filter = data[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR");
    ```
    - since the Raptors could be either a "Home" or "Visiting" team depending on the game, the correct points value would come from either the `hTeam.score.points` property or the "vTeam.score.points" property; I used a ternary operator to solve this issue
    ```
     <p className="Score">
       {filter.length !== 0? filter.map(item => item.hTeam.shortName === "TOR"? item.hTeam.score.points : item.vTeam.score.points): "---"}</p>
       
  - next I had difficulty rendering a single statistical leader, I only wanted to display the player with the highest total of a specified stat; i.e only the headshot and name of the player with the highest amount of points in the game will be displayed
    - however, the "api-nba" API would give me JSON data comprised of multiple statistical leaders instead of just one; i.e there would be two statistical leaders for points with different totals
    ```
    leaders: Array(6)
    0: {points: '37', playerId: '479', name: 'Pascal Siakam'}
    1: {rebounds: '11', playerId: '479', name: 'Pascal Siakam'}
    2: {assists: '12', playerId: '479', name: 'Pascal Siakam'}
    3: {points: '16', playerId: '1058', name: 'Gary Trent Jr.'}
    4: {assists: '2', playerId: '570', name: 'Thaddeus Young'}
    5: {rebounds: '10', playerId: '2789', name: 'Scottie Barnes'}
    ```
    - in the above example, the JSON data is giving me two objects that have "points" properties, two objects that have "assists" properties and two objects that have "rebounds" properties; I only want to render the `Array[0]` object because it has the greater "points" property (37 points compared to 16 points) 
      - solved by first filtering out the objects that have either the property "points", "rebounds" or "assists" depending on the specified stat
      ```
      const statsFilter = data[0].api.games.filter(item => item.hTeam.shortName === "TOR" || item.vTeam.shortName === "TOR")
      .length !== 0? data[2].api.game[0].hTeam: null;
      
      const rapsPoints = statsFilter !== null? statsFilter.shortName === "TOR"? data[2].api.game[0].hTeam.leaders
      .filter(item => item.hasOwnProperty("points")): data[2].api.game[0].vTeam.leaders.filter(item => item.hasOwnProperty("points")): null;
      ```
      - I then proceeded to parse each item in the filtered array to an integer using a `.map()` function
      ```
      const rapsPointsParsed = rapsPoints !== null? rapsPoints.map(item => parseInt(item.points)): null;
      ```
      - after, I set a `const` variable to the largest integer in `const rapsPointsParsed` using `Math.max()`
      ```
      const rapsPointsLeader = rapsPointsParsed !== null? Math.max(...rapsPointsParsed): null;
      ```
      - finally, to get the appropriate data to render I filtered out the properties that are equal to `const rapsPointsLeader`
      ```
       <img className="headShot" src={filter.length !== 0? data[1].filter(item => item.firstName == rapsPointsSplitFN && item.lastName.includes(rapsPointsSplitLN)).map(item => item.headShotUrl)[0]: "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"}/>
          <p className="Player-Name">{filter.length !== 0? rapsPoints.filter(item => item.points == rapsPointsLeader).map(item => item.name)[0]: ""}</p>
          <p className="points">{filter.length !== 0? rapsPoints.filter(item => item.points == rapsPointsLeader).map(item => item.points)[0]: ""}</p>
      ```
  - finally, I had difficulty figuring out how to refetch data without refreshing the actual page
    - solved by using a `setInterval()` function within the `useEffect` hook, fetching data every 15 seconds
    ```
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
      ```

