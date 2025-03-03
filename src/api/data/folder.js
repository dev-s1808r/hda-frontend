import { useState, useEffect } from "react";
import api from "../instance";

const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recall, setRecall] = useState(1);
  const refetch = () => {
    console.log("refetching");
    setRecall(recall * -1);
  };

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/folders`);
        console.log(response.data, "from hook");
        setFolders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [recall]);

  return { folders, loading, error, refetch };
};

export default useFolders;
