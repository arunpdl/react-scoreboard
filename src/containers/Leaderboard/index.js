import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { mergeData } from "../../utils/deepMerge";
import { useDataList } from "../../hooks/useDataList";

const Leaderboard = () => {
  const [dataList] = useDataList();
  const [leaderboardData, setLeaderboardData] = useState();

  const getWinCount = useCallback((gameList, currentTeam) => {
    const winData = gameList.reduce((count, eachGame) => {
      if (
        (eachGame.team1Name === currentTeam &&
          eachGame.team1Score > eachGame.team2Score) ||
        (eachGame.team2Name === currentTeam &&
          eachGame.team2Score > eachGame.team1Score)
      ) {
        return count + 1;
      }
      return count + 0;
    }, 0);
    return winData;
  }, []);

  const getLossCount = useCallback((gameList, currentTeam) => {
    const lossData = gameList.reduce((count, eachGame) => {
      if (
        +eachGame.team1Score < +eachGame.team2Score &&
        eachGame.team1Name === currentTeam
      ) {
        return count + 1;
      } else if (
        +eachGame.team2Score < +eachGame.team1Score &&
        eachGame.team2Name === currentTeam
      ) {
        return count + 1;
      }
      return count + 0;
    }, 0);
    return lossData;
  }, []);

  const getDrawCount = useCallback((gameList) => {
    const drawData = gameList.reduce((count, eachGame) => {
      if (+eachGame.team1Score === +eachGame.team2Score) {
        return count + 1;
      }
      return count + 0;
    }, 0);
    return drawData;
  }, []);

  const getPoints = useCallback(
    (gameList, currentTeam) => {
      const winCount = getWinCount(gameList, currentTeam);
      const lossCount = getLossCount(gameList, currentTeam);
      const drawCount = getDrawCount(gameList);
      const finalPoint = winCount * 3 + drawCount * 1 + lossCount * 0;
      return finalPoint;
    },
    [getDrawCount, getLossCount, getWinCount]
  );

  useEffect(() => {
    const team1 = _.groupBy(dataList, "team1Name");
    const team2 = _.groupBy(dataList, "team2Name");
    const merged = mergeData(team1, team2);
    const leaderboardData = Object.entries(merged).map((eachData) => {
      return {
        teamName: eachData[0],
        played: eachData[1].length,
        win: getWinCount(eachData[1], eachData[0]),
        loss: getLossCount(eachData[1], eachData[0]),
        draw: getDrawCount(eachData[1]),
        points: getPoints(eachData[1], eachData[0]),
      };
    });
    const sortedData = leaderboardData?.sort((a, b) => b.points - a.points);
    setLeaderboardData(sortedData);
  }, [dataList, getDrawCount, getLossCount, getPoints, getWinCount]);

  return (
    <div>
      <h1 className="text-2xl">Leaderboard</h1>
      <div className="m-2 p-4">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="rounded-lg text-sm font-medium text-gray-700 text-left">
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Team Name</th>
              <th className="px-4 py-2">Played</th>
              <th className="px-4 py-2">Win</th>
              <th className="px-4 py-2">Draw</th>
              <th className="px-4 py-2">Loss</th>
              <th className="px-4 py-2">Points</th>
            </tr>
          </thead>
          {leaderboardData?.length > 0 ? (
            <tbody className="text-sm font-normal text-gray-700">
              {leaderboardData?.map((eachRow, index) => (
                <tr
                  key={eachRow.teamName}
                  className="hover:bg-gray-100 border-b border-gray-200 py-10"
                >
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">{eachRow.teamName}</td>
                  <td className="px-4 py-4">{eachRow.played}</td>
                  <td className="px-4 py-4">{eachRow.win}</td>
                  <td className="px-4 py-4">{eachRow.draw}</td>
                  <td className="px-4 py-4">{eachRow.loss}</td>
                  <td className="px-4 py-4">{eachRow.points}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-sm font-normal text-gray-700">
              <tr className="border-b border-gray-200 py-10">
                <td className="px-4 py-4" colSpan="7">
                  No scores found!
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
