import axios from "axios";
import Redis from "ioredis";
import { getStartPoint } from "./playSong";

let redis = new Redis(process.env.REDIS_URL);

export default async (req, res) => {
  let start = Date.now();
  let cache = await redis.get("cache");
  cache = JSON.parse(cache);
  let result = {};
  if (cache) {
    console.log("loading from cache");
    result.data = cache;
    result.type = "redis";
    result.latency = Date.now() - start;
    return res.status(200).json(result);
  } else {
    console.log("loading from api");
    const accessToken =
      "BQBMMGqAx1x_F6MPSApmAxVb7WO8q_Bp3H570bnWuFkSXmjaMbCmgpX2efb_YhCtj7DGJYlEvJQ2eWrvdT0b4mOQuylwMzaFbrrLD1XXZaJBd8cRki2mPYNWQcoPm1n7Z954wCj61z8hsDxgH1iUNdB-qnsuUST3if-xMJH-K7-Vp8JkgmlFo9rO3Qabcg6cz24mrVTEQMVM1I7F7XyNQ_WUC4gUB6LlwdLIhNnyE9BiXqr9g_HLugHNmOIfDsQFFw";
    const todaysTopHitsId = "37i9dQZF1DXcBWIGoYBM5M";
    start = Date.now();
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${todaysTopHitsId}/tracks?fields=items(track(id))`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data.items;
    data = await Promise.all(
      data.map(async (song) => await getStartPoint(song.track.id, accessToken))
    );
    result.data = data;
    result.type = "api";
    result.latency = Date.now() - start;
    redis.set("cache", JSON.stringify(result.data), "EX", 60);
    return res.status(200).json(result);

    // return fetch("https://coronavirus-19-api.herokuapp.com/countries")
    //   .then((r) => r.json())
    //   .then((data) => {
    //     data.sort(function (a, b) {
    //       return b.todayCases - a.todayCases;
    //     });
    //     result.data = data.splice(1, 11);
    //     result.type = "api";
    //     result.latency = Date.now() - start;
    //     redis.set("cache", JSON.stringify(result.data), "EX", 60);
    //     return res.status(200).json(result);
    //   });
  }
};
