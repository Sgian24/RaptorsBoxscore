# Raptors Boxscore

A boxscore I made that displays the score and stastical leaders for live Toronto Raptors games.

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

