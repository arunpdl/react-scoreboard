import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { groupByKey } from "../../utils/groupBy";
import { exportFile } from "../../utils/fileImportExport";
import { useDataList } from "../../hooks/useDataList";
import DeleteIcon from "../../assets/icons/delete.svg";
import ImportIcon from "../../assets/icons/import.svg";
import ExportIcon from "../../assets/icons/export.svg";

const getWinnerTeam = (matchDetail) => {
  if (+matchDetail.team1Score > +matchDetail.team2Score) return 0;
  if (+matchDetail.team1Score < +matchDetail.team2Score) return 1;
  return -1;
};

const ResultList = () => {
  const [dataList, , , deleteData, importData] = useDataList();
  const normalisedData = groupByKey(dataList, "matchDate");
  const fileInputRef = useRef();

  const handleDelete = (data) => {
    deleteData(data);
  };

  const handleExportData = (e) => {
    e.preventDefault();
    exportFile(JSON.stringify(dataList), "score_data.json", "application/json");
  };

  const handleImportData = (e) => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const data = JSON.parse(reader.result);
        importData(data);
      });
      reader.readAsText(e.target.files[0]);
      // saveFile();
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Results</h1>
      <div>
        <ul>
          {normalisedData && Object.keys(normalisedData).length > 0 ? (
            <>
              {Object.entries(normalisedData).map((eachDate) => (
                <div key={eachDate[0]}>
                  <li className="font-bold">{eachDate[0]}</li>
                  <ol>
                    {eachDate[1].map((eachMatch) => (
                      <div key={eachMatch.id} className="flex items-center">
                        <Link to={`/edit/${eachMatch.id}`}>
                          <li>
                            <div className="flex ml-5 my-4 items-center">
                              <div
                                className={
                                  getWinnerTeam(eachMatch) === 0
                                    ? "text-green-700"
                                    : ""
                                }
                              >
                                {eachMatch?.team1Name} ({eachMatch?.team1Score}){" "}
                              </div>
                              <span className="mx-5 text-sm">vs</span>
                              <div
                                className={
                                  getWinnerTeam(eachMatch) === 1
                                    ? "text-green-700"
                                    : ""
                                }
                              >
                                {eachMatch?.team2Name} ({eachMatch?.team2Score})
                              </div>
                            </div>
                          </li>
                        </Link>
                        <img
                          src={DeleteIcon}
                          alt="delete"
                          className="ml-8 w-4 cursor-pointer"
                          onClick={(e) => handleDelete(eachMatch)}
                        />
                      </div>
                    ))}
                  </ol>
                </div>
              ))}
            </>
          ) : (
            <div>
              <div className="text-lg">No results found!</div>
              <Link className="text-sm" to="/new">
                Click here to add new result
              </Link>
            </div>
          )}
        </ul>
      </div>
      <div className="flex items-center space-x-6 mt-6 text-sm">
        {dataList?.length > 0 && (
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-blue-200 rounded-md"
          >
            <img src={ExportIcon} alt="export" className="h-4 w-4" />
            <span className="ml-2">Export</span>
          </button>
        )}
        <button
          onClick={handleImportData}
          className="flex items-center px-4 py-2 bg-blue-200 rounded-md"
        >
          <img src={ImportIcon} alt="import" className="h-4 w-4" />
          <span className="ml-2">Import</span>
        </button>
      </div>
      <input
        type="file"
        onChange={handleFileSelect}
        hidden
        ref={fileInputRef}
        accept="application/json"
      />
    </div>
  );
};

export default ResultList;
