import { useState } from "react";
import uniqBy from "lodash/uniqBy";

export const useDataList = (initialValue = [], key = "dataList") => {
  const [dataList, setDataList] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const saveValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(dataList) : value;
      const newData = [valueToStore, ...dataList];
      setDataList(newData);
      window.localStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const updateValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(dataList) : value;
      const newData = dataList?.map((eachData) => {
        if (eachData.id === valueToStore.id) {
          return valueToStore;
        }
        return eachData;
      });

      setDataList(newData);
      window.localStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(dataList) : value;

      const filteredData = dataList?.filter(
        (eachData) => eachData.id !== valueToStore.id
      );

      setDataList(filteredData);
      window.localStorage.setItem(key, JSON.stringify(filteredData));
    } catch (error) {
      console.log(error);
    }
  };

  const importData = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(dataList) : value;
      const mergedData = [...valueToStore, ...dataList];
      const uniqueData = uniqBy(mergedData, "id");

      setDataList(uniqueData);
      window.localStorage.setItem(key, JSON.stringify(uniqueData));
    } catch (error) {
      console.log(error);
    }
  };

  return [dataList, saveValue, updateValue, deleteValue, importData];
};
