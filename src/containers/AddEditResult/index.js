import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useParams, useHistory } from "react-router-dom";
import { useDataList } from "../../hooks/useDataList";
import { groupByKey } from "../../utils/groupBy";

const AddEditResult = () => {
  const { id } = useParams();
  const history = useHistory();

  const initialData = () => ({
    id: nanoid(),
    matchDate: new Date().toISOString().split("T")[0],
    team1Name: "",
    team1Score: "",
    team2Name: "",
    team2Score: "",
  });

  const [errors, setErrors] = useState({});

  const [dataList, saveData, updateData] = useDataList();

  const normalisedData = groupByKey(dataList, "id");

  const [gameData, setGameData] = useState(() => {
    if (id && normalisedData[id]) {
      return normalisedData[id][0];
    }
    return initialData();
  });

  useEffect(() => {
    if (!id) {
      setGameData(initialData());
    }
  }, [id]);

  const validate = () => {
    const err = {};
    if (!gameData?.matchDate) err.matchDate = "Match Date cannot be empty";
    if (!gameData.team1Name) err.team1Name = "Team name cannot be empty";
    if (!gameData.team1Score) err.team1Score = "Team score cannot be empty";
    if (gameData.team1Score && +gameData.team1Score < 0)
      err.team1Score = "Team score cannot be negative";
    if (!gameData.team2Name) err.team2Name = "Team name cannot be empty";
    if (!gameData.team2Score) err.team2Score = "Team score cannot be empty";
    if (gameData.team2Score && +gameData.team2Score < 0)
      err.team2Score = "Team score cannot be negative";
    if (gameData.team1Name === gameData.team2Name)
      err.team2Name = "Both teams cannot have same name";
    setErrors(err);
    return err;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validate();
    if (errors && Object.keys(errors).length === 0) {
      if (id && normalisedData[id]) {
        updateData(gameData);
      } else {
        saveData(gameData);
      }
      history.push("/");
    }
  };

  const handleChange = (e) => {
    setGameData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (event) => {
    setGameData((prevData) => ({
      ...prevData,
      matchDate: event.target.value,
    }));
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">{id ? <>Edit</> : <>Add</>} Result</h1>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-around items-center"
        >
          <div className="mr-10">
            <h4 className="my-5 text-2xl">Team One</h4>
            <div className="flex flex-col mb-4">
              <label htmlFor="team1Name">Name</label>
              <input
                name="team1Name"
                id="team1Name"
                value={gameData.team1Name || ""}
                onChange={handleChange}
                type="text"
              />
              {errors.team1Name && <p className="error">{errors.team1Name}</p>}
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="team1Score">Score</label>
              <input
                name="team1Score"
                id="team1Score"
                value={gameData.team1Score || ""}
                onChange={handleChange}
                type="number"
              />
              {errors.team1Score && (
                <p className="error">{errors.team1Score}</p>
              )}
            </div>
          </div>
          <div className="mr-10">
            <h4 className="my-5 text-2xl">Team Two</h4>
            <div className="flex flex-col mb-4">
              <label htmlFor="team2Name">Name</label>
              <input
                name="team2Name"
                id="team2Name"
                value={gameData.team2Name || ""}
                onChange={handleChange}
                type="text"
              />
              {errors.team2Name && <p className="error">{errors.team2Name}</p>}
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="team2Score">Score</label>
              <input
                name="team2Score"
                id="team2Score"
                value={gameData.team2Score || ""}
                onChange={handleChange}
                type="number"
              />
              {errors.team2Score && (
                <p className="error">{errors.team2Score}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label>Date</label>
            <input
              type="date"
              value={gameData?.matchDate}
              onChange={handleDateChange}
              name="matchDate"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 rounded-md">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditResult;
